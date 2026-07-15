import ProjectModel from "../models/Project.js";
import WorkspaceModel from "../models/Workspace.js";
import TaskModel from "../models/Task.js";
import UserModel from "../models/User.js";

export const createTask = async (projectId, ownerId, data) => {
  const {
    title,
    description,
    assignedTo,
    status,
    priority,
    dueDate,
    isArchived,
  } = data;
  if (!title) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }

  //validate project ownership
  const existingProject = await ProjectModel.findById(projectId);
  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  //validate workspace ownership
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: existingProject.workspace,
    owner: ownerId,
  });
  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  //duplicate task title
  const existingTask = await TaskModel.findOne({
    project: projectId,
    title,
  });
  if (existingTask) {
    const error = new Error("Task already exist");
    error.statusCode = 409;
    throw error;
  }
  if (assignedTo) {
    const existingMember = await MemberModel.findOne({
      workspace: existingWorkspace._id,
      user: assignedTo,
    });

    if (!existingMember) {
      const error = new Error(
        "Assigned user is not a member of this workspace",
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const due = dueDate ? new Date(dueDate) : null;
  if (
    due &&
    existingProject.startDate &&
    existingProject.dueDate &&
    (due < existingProject.startDate || due > existingProject.dueDate)
  ) {
    const error = new Error(
      "Task due date must be greater than project start date and less than project due date",
    );
    error.statusCode = 400;
    throw error;
  }
  const newTask = await TaskModel.create({
    title,
    description,
    project: projectId,
    createdBy: ownerId,
    assignedTo,
    status,
    priority,
    dueDate: due,
    isArchived,
  });
  return newTask;
};
export const getAllTasks = async (projectId, ownerId) => {
  //validate project ownership
  const existingProject = await ProjectModel.findById(projectId);
  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }
  //validate workspace ownership
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: existingProject.workspace,
    owner: ownerId,
  });
  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const tasks = await TaskModel.find({
    project: projectId,
  }).sort({ createdAt: -1 });
  return tasks;
};
export const getTask = async (taskId, ownerId) => {
  // 1. Validate task
  const existingTask = await TaskModel.findById(taskId);

  if (!existingTask) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate project
  const existingProject = await ProjectModel.findById(existingTask.project);

  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Validate workspace ownership
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: existingProject.workspace,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  return existingTask;
};
export const updateTask = async (taskId, ownerId, data) => {
  const {
    title,
    description,
    assignedTo,
    status,
    priority,
    dueDate,
    isArchived,
  } = data;

  // Validate Task
  const existingTask = await TaskModel.findById(taskId);

  if (!existingTask) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // Validate Project
  const existingProject = await ProjectModel.findById(existingTask.project);

  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // Validate Workspace Ownership
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: existingProject.workspace,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  // Final title
  const finalTitle = title ?? existingTask.title;

  // Duplicate title validation
  if (finalTitle !== existingTask.title) {
    const duplicateTask = await TaskModel.findOne({
      project: existingProject._id,
      title: finalTitle,
      _id: { $ne: taskId },
    });

    if (duplicateTask) {
      const error = new Error("Task already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  // Validate assigned member
  if (assignedTo) {
    const existingMember = await MemberModel.findOne({
      workspace: existingWorkspace._id,
      user: assignedTo,
    });

    if (!existingMember) {
      const error = new Error(
        "Assigned user is not a member of this workspace",
      );
      error.statusCode = 400;
      throw error;
    }
  }

  // Final due date
  const finalDueDate = dueDate ?? existingTask.dueDate;
  const due = finalDueDate ? new Date(finalDueDate) : null;

  if (
    due &&
    existingProject.startDate &&
    existingProject.dueDate &&
    (due < existingProject.startDate || due > existingProject.dueDate)
  ) {
    const error = new Error(
      "Task due date must be within the project's duration",
    );
    error.statusCode = 400;
    throw error;
  }

  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      title: finalTitle,
      description: description ?? existingTask.description,
      assignedTo: assignedTo ?? existingTask.assignedTo,
      status: status ?? existingTask.status,
      priority: priority ?? existingTask.priority,
      dueDate: due,
      isArchived: isArchived ?? existingTask.isArchived,
    },
    {
      new: true,
    },
  );

  return updatedTask;
};
export const deleteTask = async (taskId, ownerId) => {
  // Validate Task
  const existingTask = await TaskModel.findById(taskId);

  if (!existingTask) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // Validate Project
  const existingProject = await ProjectModel.findById(existingTask.project);

  if (!existingProject) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // Validate Workspace Ownership
  const existingWorkspace = await WorkspaceModel.findOne({
    _id: existingProject.workspace,
    owner: ownerId,
  });

  if (!existingWorkspace) {
    const error = new Error("Workspace not found");
    error.statusCode = 404;
    throw error;
  }

  const deletedTask = await TaskModel.findByIdAndDelete(taskId);

  return deletedTask;
};
