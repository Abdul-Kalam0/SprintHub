import MemberModel from "../models/Member.js";
import UserModel from "../models/User.js";
import WorkspaceModel from "../models/Workspace.js";

export const addMember = async (workspaceId, ownerId, memberUserId, role) => {
  // Validate input
  if (!memberUserId) {
    const error = new Error("Member user id is required");
    error.statusCode = 400;
    throw error;
  }

  // Check owner own's workspace
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: ownerId,
  });
  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  // Check invited member exist or not
  const existingMember = await UserModel.findById(memberUserId);
  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent owner from adding itself as member
  if (ownerId.toString() === memberUserId) {
    const error = new Error("Owner is already a member of this workspace");
    error.statusCode = 409;
    throw error;
  }

  //Check duplicate membership
  const duplicateMember = await MemberModel.findOne({
    workspace: workspaceId,
    user: memberUserId,
  });
  if (duplicateMember) {
    const error = new Error("User is already a member of this workspace");
    error.statusCode = 409;
    throw error;
  }

  const workspaceMember = await MemberModel.create({
    workspace: workspaceId,
    user: memberUserId,
    role,
  });

  return workspaceMember;
};

export const getAllMember = async (workspaceId, ownerId) => {
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const existingMembers = await MemberModel.find({
    workspace: workspaceId,
  }).populate("user", "name email avatar");
  return existingMembers;
};

export const updateMember = async (workspaceId, ownerId, memberId, role) => {
  if (!role) {
    const error = new Error("Role is required");
    error.statusCode = 400;
    throw error;
  }
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const existingMember = await MemberModel.findOne({
    _id: memberId,
    workspace: workspaceId,
  });
  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedMember = await MemberModel.findByIdAndUpdate(
    memberId,
    {
      role: role,
    },
    {
      new: true,
    },
  );

  return updatedMember;
};

export const deleteMember = async (workspaceId, memberId, ownerId) => {
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: ownerId,
  });
  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const existingMember = await MemberModel.findOne({
    _id: memberId,
    workspace: workspaceId,
  });
  if (!existingMember) {
    const error = new Error("Member not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting the workspace owner
  if (existingMember.role === "owner") {
    const error = new Error("Workspace owner cannot be removed");
    error.statusCode = 403;
    throw error;
  }

  const deletedMember = await MemberModel.findOneAndDelete({
    _id: memberId,
    workspace: workspaceId,
  });

  return deletedMember;
};
