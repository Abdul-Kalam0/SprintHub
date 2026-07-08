import {
  addMember as createMemberService,
  getAllMember as getAllMemberService,
  updateMember as updateMemberService,
  deleteMember as deleteMemberService,
} from "../services/workspaceMember.service.js";

export const addMember = async (req, res, next) => {
  try {
    const newMember = await addMemberService(
      req.params.workspaceId,
      req.user._id,
      req.body.memberUserId,
      req.body.role,
    );

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMember = async (req, res, next) => {
  try {
    const members = await getAllMemberService(
      req.params.workspaceId,
      req.user._id,
    );
    return res.status(200).json({
      success: true,
      message: "All members",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const updatedMember = await updateMemberService(
      req.params.workspaceId,
      req.user._id,
      req.params.memberId,
      req.body.role,
    );
    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    const deletedMember = await deleteMemberService(
      req.params.workspaceId,
      req.params.memberId,
      req.user._id,
    );
    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
      data: deletedMember,
    });
  } catch (error) {
    next(error);
  }
};
