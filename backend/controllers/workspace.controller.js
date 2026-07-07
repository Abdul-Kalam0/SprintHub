import {
  createWorkspace as createWorkspaceService,
  getAllWorkspace as getAllWorkspaceService,
  getWorkspace as getWorkspaceService,
  updateWorkspace as updateWorkspaceService,
  deleteWorkspace as deleteWorkspaceService,
} from "../services/workspace.service.js";
export const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await createWorkspaceService(req.user._id, req.body.name);
    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllWorkspace = async (req, res, next) => {
  try {
    const workspaces = await getAllWorkspaceService(req.user._id);
    return res.status(200).json({
      success: true,
      message: "All workspaces",
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};
export const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceService(req.params.id, req.user._id);
    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};
export const updateWorkspace = async (req, res, next) => {
  try {
    const updatedWorkspace = await updateWorkspaceService(
      req.params.id,
      req.user._id,
      req.body.name,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: updatedWorkspace,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteWorkspace = async (req, res, next) => {
  try {
    const deletedWorkspace = await deleteWorkspaceService(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      data: deletedWorkspace,
    });
  } catch (error) {
    next(error);
  }
};
