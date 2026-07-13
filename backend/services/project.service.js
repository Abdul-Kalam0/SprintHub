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
  const start = startDate ? new Date(startDate) : null;
  const due = dueDate ? new Date(dueDate) : null;

  if (start && due && start > due) {
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
    startDate: start,
    dueDate: due,
    description,
    isArchived,
  });

  return newProject;
};
export const getAllProjects = async (workspaceId, ownerId) => {
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

  const projects = await ProjectModel.find({
    workspace: workspaceId,
  }).sort({ createdAt: -1 });

  return projects;
};
export const getProject = async (workspaceId, ownerId, projectId) => {
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

  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  });
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};
export const updateProject = async (workspaceId, ownerId, projectId, data) => {
  const { name, description, status, isArchived, startDate, dueDate } = data;

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
    _id: projectId,
  });
  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const finalName = name ?? existingProject.name;
  if (existingProject.name !== finalName) {
    const duplicateProject = await ProjectModel.findOne({
      workspace: workspaceId,
      name: finalName,
    });
    if (duplicateProject) {
      const error = new Error("Project already exist");
      error.statusCode = 409;
      throw error;
    }
  }

  const finalStartDate = startDate ?? existingProject.startDate;
  const finalDueDate = dueDate ?? existingProject.dueDate;
  const start = finalStartDate ? new Date(finalStartDate) : null;
  const due = finalDueDate ? new Date(finalDueDate) : null;

  if (start && due && start > due) {
    const error = new Error("Due date must be after start date");
    error.statusCode = 400;
    throw error;
  }

  const updatedProject = await ProjectModel.findOneAndUpdate(
    {
      _id: projectId,
      workspace: workspaceId,
    },
    {
      name: finalName,
      description: description ?? existingProject.description,
      status: status ?? existingProject.status,
      isArchived: isArchived ?? existingProject.isArchived,
      dueDate: due,
      startDate: start,
    },
    {
      new: true,
    },
  );
  return updatedProject;
};
export const deleteProject = async (workspaceId, ownerId, projectId) => {
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
    _id: projectId,
  });
  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const deletedProject = await ProjectModel.findOneAndDelete({
    workspace: workspaceId,
    _id: projectId,
  });

  return deletedProject;
};
