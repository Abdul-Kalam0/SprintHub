import {
  createProject as createProjectService,
  getAllProjects as getAllProjectsService,
  getProject as getProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const newProject = await createProjectService(
      req.params.workspaceId,
      req.user._id,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProjects = async (req, res, next) => {};
export const getProject = async (req, res, next) => {};
export const updateProject = async (req, res, next) => {};
export const deleteProject = async (req, res, next) => {};
