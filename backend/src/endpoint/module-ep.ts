import { Request, Response, NextFunction } from "express";
import { createCourseDao } from "../dao/course-dao";
import { Role, AdminType, LecturerType } from "../enums/UserEnums";
import { Util } from "../utils/util";
import { IModuleMaterial } from "../modal/IModuleMaterial";
import { createMaterialDao, createSubmissionDao, deleteModuleMaterialDao, deleteSubmissionDao, getMaterialByIdDao, getMaterialDao, getSubmissionByAssignmentIdDao, getSubmissionByIdDao, UpdateMaterialDao, updateSubmissionDao } from "../dao/module-dao";
import { IAssignmentSubmission } from "../modal/IAssignmentSubmission";

export const createMaterial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const lecturer = req.user.userId;
    const userRole = req.user.userRole
    try {
        if (userRole !== Role.LECTURER) {
            return Util.sendError(res, "You are not authorized to create module material", 401);
        }
        const courseDetails = await createMaterialDao(req.body as IModuleMaterial, lecturer);
        return Util.sendSuccess(res, courseDetails, "module material created successfully");
    } catch (error) {
        next(error);
    }
};
export const updateMaterial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const materialId = req.params.materialId;
    const lecturer = req.user.userId;
    const userRole = req.user.userRole
    try {
        if (userRole !== Role.LECTURER) {
            return Util.sendError(res, "You are not authorized to update module material", 401);
        }
        const courseDetails = await UpdateMaterialDao(req.body as Partial<IModuleMaterial>, lecturer, materialId);
        return Util.sendSuccess(res, courseDetails, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const getMaterialById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const materialId = req.params.materialId;
    try {
        const material = await getMaterialByIdDao(materialId);
        return Util.sendSuccess(res, material, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const deleteMaterial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const materialId = req.params.materialId;
    const userRole = req.user.userRole
    try {
        if (userRole !== Role.LECTURER) {
            return Util.sendError(res, "You are not authorized to update module material", 401);
        }
        const deleteMaterial = await deleteModuleMaterialDao(materialId);
        return Util.sendSuccess(res, deleteMaterial, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const getSubmissionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const submissionId = req.params.submissionId;
    console.log(submissionId);
    try {
        const submission = await getSubmissionByIdDao(submissionId);
        return Util.sendSuccess(res, submission, "submission fetch successfully");
    } catch (error) {
        next(error);
    }
};
export const createSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { assignmentId, fileUrl} = req.body;
    const userRole = req.user.userRole;
    const userId = req.user.userId;
    try {
        if (userRole !== Role.STUDENT) {
            return Util.sendError(res, "You are not authorized to submit", 401);
        }
        const submission = await createSubmissionDao(userId, assignmentId, fileUrl);
        return Util.sendSuccess(res, submission, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const updateSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const submissionId = req.params.submissionId;
    try {
        const submission = await updateSubmissionDao(submissionId, req.body as Partial<IAssignmentSubmission>);
        return Util.sendSuccess(res, submission, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const deleteSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const submissionId = req.params.submissionId;
    const userRole = req.user.userRole
    try {
        if (userRole !== Role.LECTURER) {
            return Util.sendError(res, "You are not authorized to update module material", 401);
        }
        const submission = await deleteSubmissionDao(submissionId);
        return Util.sendSuccess(res, submission, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const getSubmissionByAssignmentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const assignmentId = req.params.assignmentId;
    const userRole = req.user.userRole
    try {
        if (userRole !== Role.LECTURER) {
            return Util.sendError(res, "You are not authorized to update module material", 401);
        }
        const assignment = await getSubmissionByAssignmentIdDao(assignmentId);
        return Util.sendSuccess(res, assignment, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
export const getMaterial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const moduleId = req.params.moduleId;
    try {
        const materials = await getMaterialDao(moduleId);
        return Util.sendSuccess(res, materials, "module material update successfully");
    } catch (error) {
        next(error);
    }
};
