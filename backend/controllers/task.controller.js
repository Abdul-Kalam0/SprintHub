import {
  createTask as createTaskService,
  getAllTasks as getAllTasksService,
  getTask as getTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../services/task.sevice.js";

export const createTask = async (req, res, next) => {
  try {
    const newTask = await createTaskService(
      req.params.projectId,
      req.user._id,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Task completed successfully",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasksService(req.params.projectId, req.user._id);
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
export const getTask = async (req, res, next) => {
  try {
    const tasks = await getAllTasksService(req.params.taskId, req.user._id);
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
export const updateTask = async (req, res, next) => {
  try {
    const tasks = await updateTaskService(
      req.params.taskId,
      req.user._id,
      data,
    );
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const tasks = await deleteTaskService(req.params.taskId, req.user._id);
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
