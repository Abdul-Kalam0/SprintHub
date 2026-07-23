import WorkspaceModel from "../models/Workspace.js";
import ProjectModel from "../models/Project.js";
import MemberModel from "../models/Member.js";
import TaskModel from "../models/Task.js";

import mongoose from "mongoose";

export const createWorkspace = async (userId, data) => {
  const { name, description } = data;
  if (!name.trim()) {
    const error = new Error("workspace name is required");
    error.statusCode = 400;
    throw error;
  }

  //duplicate workspace
  const existingWorkspace = await WorkspaceModel.findOne({
    owner: userId,
    name: name.trim(),
  });
  if (existingWorkspace) {
    const error = new Error("Workspace with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  // Create new workspace
  const workspace = await WorkspaceModel.create({
    name: name.trim(),
    description: description?.trim() || "",
    owner: userId,
  });

  await MemberModel.create({
    workspace: workspace._id,
    user: userId,
    role: "owner",
  });

  return workspace;
};

export const getAllWorkspace = async (userId) => {
  return await WorkspaceModel.find({ owner: userId }).sort({ createdAt: -1 });
};
export const getWorkspace = async (workspaceId, userId) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: userId,
  });
  if (!workspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }
  return workspace;
};

export const updateWorkspace = async (workspaceId, userId, data) => {
  const { name, description } = data;
  if (!name?.trim()) {
    const error = new Error("workspace name is required");
    error.statusCode = 400;
    throw error;
  }

  //check for duplicate worksPace name
  const existingWorkspace = await WorkspaceModel.findOne({
    owner: userId,
    name: name.trim(),
    _id: { $ne: workspaceId },
  });

  if (existingWorkspace) {
    const error = new Error("Workspace with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const updateData = {};
  if (name !== undefined) {
    updateData.name = name.trim();
  }
  if (description !== undefined) {
    updateData.description = description.trim();
  }

  const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
    { _id: workspaceId, owner: userId },
    updateData,
    { new: true },
  );

  if (!updatedWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }
  return updatedWorkspace;
};

export const deleteWorkspace = async (workspaceId, userId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //check workspace exist or not
    const existingWorkspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      owner: userId,
    }).session(session);
    if (!existingWorkspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    //find all the projects of current workspace
    const projects = await ProjectModel.find({ workspace: workspaceId })
      .select("_id")
      .session(session);

    const projectsId = projects.map((project) => project._id);

    //first delete all the task present in the project
    await TaskModel.deleteMany({ project: { $in: projectsId } }).session(
      session,
    );

    //delete all the project inside this workspace
    await ProjectModel.deleteMany({
      workspace: workspaceId,
      _id: { $in: projectsId },
    }).session(session);

    //now delete the workspaceMembers
    await MemberModel.deleteMany({ workspace: workspaceId }).session(session);

    //now delete workspace
    await existingWorkspace.deleteOne({ session });

    await session.commitTransaction();
    return existingWorkspace;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
