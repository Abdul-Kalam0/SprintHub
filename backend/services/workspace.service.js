import WorkspaceModel from "../models/Workspace.js";
import MemberModel from "../models/Member.js";

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
    description: description.trim() || "",
  });
  if (existingWorkspace) {
    const error = new Error("Workspace with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  // Create new workspace
  const workspace = await WorkspaceModel.create({
    name: workspaceName.trim(),
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

export const updateWorkspace = async (workspaceId, userId, workspaceName) => {
  if (!workspaceName) {
    const error = new Error("workspace name is required");
    error.statusCode = 400;
    throw error;
  }
  const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
    { _id: workspaceId, owner: userId },
    {
      name: workspaceName,
    },
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
  const deletedWorkspace = await WorkspaceModel.findOneAndDelete({
    _id: workspaceId,
    owner: userId,
  });

  if (!deletedWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  await MemberModel.deleteMany({
    workspace: workspaceId,
  });

  return deletedWorkspace;
};
