import ProjectModel from "../models/Project.js";
import WorkspaceModel from "../models/Workspace.js";

export const createProject = async (workspaceId, ownerId, data) => {
  const { name, description, status, startDate, dueDate, isArchived } = data;
  if (!name) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  //due date must be after start date
  if (startDate && dueDate && startDate > dueDate) {
    const error = new Error("Due date must be after start date");
    error.statusCode = 400;
    throw error;
  }

  // checking whether this workspace is of current loggedin user
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: workspaceId,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const existingProject = await ProjectModel.findOne({
    workspace: workspaceId,
    name,
  });

  if (existingProject) {
    const error = new Error("Project already exist");
    error.statusCode = 409;
    throw error;
  }

  const newProject = await ProjectModel.create({
    name: name,
    workspace: workspaceId,
    createdBy: ownerId,
    status,
    startDate,
    dueDate,
    description,
    isArchived,
  });

  return newProject;
};
export const getAllProjects = async () => {};
export const getProject = async () => {};
export const updateProject = async () => {};
export const deleteProject = async () => {};
