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
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjectsService(
      req.params.workspaceId,
      req.user._id,
    );
    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};
export const getProject = async (req, res, next) => {
  try {
    const project = await getProjectsService(
      req.params.workspaceId,
      req.user._id,
      req.params.projectId,
    );
    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const updatedProject = await updateProjectService(
      req.params.workspaceId,
      req.user._id,
      req.params.projectId,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const deletedProject = await deleteProjectService(
      req.params.workspaceId,
      req.user._id,
      req.params.projectId,
    );

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    next(error);
  }
};
