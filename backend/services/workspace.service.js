import WorkspaceModel from "../models/Workspace.js";

export const createWorkspace = async (userId, workspaceName) => {
  if (!workspaceName) {
    const error = new Error("workspace name is required");
    error.statusCode = 400;
    throw error;
  }

  // Create new workspace
  const workspace = await WorkspaceModel.create({
    name: workspaceName,
    owner: userId,
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

  return deletedWorkspace;
};
