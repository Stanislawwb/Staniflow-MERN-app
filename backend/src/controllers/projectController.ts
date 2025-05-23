import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";
import Project, { ProjectDocument } from "../models/projectModel";
import User from "../models/userModel";
import { sendWebSocketMessage } from "../service/websocketService";
import { calculateProjectProgress } from "../util/project/calculateProgress";

const findProjectById = async (projectId: string) => {
	const project = await Project.findById(projectId);
	if (!project) throw createHttpError(404, "Project not found");
	return project;
};

type Role = "admin" | "developer" | "guest";

type CreateProjectBody = {
	title: string;
	description?: string;
	status?: "In Progress" | "Completed";
	members?: {
		userId: string;
		role?: Role;
	}[];
	tags?: string[];
	dueDate?: string;
};

export const createProject: RequestHandler<
	unknown,
	unknown,
	CreateProjectBody,
	unknown
> = async (req, res, next) => {
	try {
		const { title, description, members, tags, dueDate } = req.body;

		const createdBy = req?.user.id;

		if (!title) {
			throw createHttpError(400, "Title is required");
		}

		if (!createdBy) {
			throw createHttpError(
				403,
				"You must be authenticated to create a project"
			);
		}

		const newProject = await Project.create({
			title,
			description,
			status: "In Progress",
			members: members?.map((member) => ({
				user: member.userId,
				role: member.role,
			})),
			tags,
			dueDate,
			createdBy,
			activityLog: [
				{
					action: "project_created",
					user: createdBy,
					timestamp: new Date(),
				},
			],
		});

		sendWebSocketMessage("PROJECT_CREATED", { project: newProject });
		res.status(201).json(newProject);
	} catch (error) {
		next(error);
	}
};

export const getProjects: RequestHandler = async (req, res, next) => {
	try {
		const { sortBy = "createdAt", sortOrder = "desc" } = req.query;

		const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
		const sortDirection = sortOrder === "asc" ? 1 : -1;

		const query = Project.find({
			$or: [
				{ createdBy: req.user._id },
				{ "members.user": req.user._id },
			],
		});

		if (sortField === "title") {
			query.collation({ locale: "en", strength: 1 });
		}

		query.sort({ [sortField]: sortDirection });

		const projects: ProjectDocument[] = await query
			.populate("createdBy", "username")
			.populate("members.user", "username avatar");

		const projectsWithProgress = await Promise.all(
			projects.map(async (project) => {
				const projectId = (project._id as Types.ObjectId).toString();
				const progress = await calculateProjectProgress(projectId);

				return {
					...project.toObject(),
					...progress,
				};
			})
		);

		res.status(200).json(projectsWithProgress);
	} catch (error) {
		next(error);
	}
};

export const getProject: RequestHandler = async (req, res, next) => {
	try {
		const projectId = req.params.projectId;

		if (!projectId) {
			throw createHttpError(400, "Project ID is required");
		}

		const project = await Project.findById(projectId)
			.populate("createdBy", "username avatar role")
			.populate("activityLog.user", "username")
			.populate("members.user", "username avatar");

		if (!project) {
			throw createHttpError(404, "Project not found");
		}

		const userHasAccess =
			project.createdBy._id.equals(req.user._id) ||
			project.members.some((member) =>
				member.user._id.equals(req.user._id)
			);

		if (!userHasAccess) {
			throw createHttpError(
				403,
				"You do not have access to this project"
			);
		}

		const progress = await calculateProjectProgress(
			(project._id as Types.ObjectId).toString()
		);

		res.status(200).json({
			...project.toObject(),
			...progress,
		});
	} catch (error) {
		next(error);
	}
};

type UpdateProjectParams = {
	projectId: string;
};

type UpdateProjectBody = {
	title: string;
	description?: string;
	status?: "In Progress" | "Completed";
	isArchived: string;
	members?: {
		userId: string;
		role?: "admin" | "editor" | "viewer";
	}[];
	tags?: string[];
	dueDate?: string;
};

export const updateProject: RequestHandler<
	UpdateProjectParams,
	unknown,
	UpdateProjectBody,
	unknown
> = async (req, res, next) => {
	try {
		const projectId = req.params.projectId;

		const {
			title,
			description,
			status,
			tags,
			dueDate,
			members,
			isArchived,
		} = req.body;

		const updatedBy = req?.user.id;

		if (!updatedBy) {
			throw createHttpError(
				403,
				"You must be authenticated to update a project"
			);
		}

		if (!projectId) {
			throw createHttpError(400, "Project ID is required");
		}

		const project = await findProjectById(projectId);

		const userHasAccess =
			project.createdBy.equals(updatedBy) ||
			project.members.some((member) => member.user.equals(updatedBy));

		if (!userHasAccess) {
			throw createHttpError(
				403,
				"You do not have permission to update this project"
			);
		}

		let hasNonStatusChanges = false;

		if (status && status !== project.status) {
			project.status = status;

			project.activityLog.push({
				action: "status_updated",
				user: updatedBy,
				status: status,
				timestamp: new Date(),
			});
		}

		if (title && title !== project.title) {
			project.title = title;
			hasNonStatusChanges = true;
		}
		if (description && description !== project.description) {
			project.description = description;
			hasNonStatusChanges = true;
		}
		if (tags) {
			project.tags = tags;
			hasNonStatusChanges = true;
		}
		if (dueDate) {
			project.dueDate = new Date(dueDate);
			hasNonStatusChanges = true;
		}
		if (members && Array.isArray(members)) {
			project.set(
				"members",
				members.map((member) => ({
					user: member.userId,
					role: member.role || "developer",
				}))
			);
			hasNonStatusChanges = true;
		}

		if (hasNonStatusChanges) {
			project.activityLog.push({
				action: "project_updated",
				user: updatedBy,
				timestamp: new Date(),
			});
		}

		if (
			typeof isArchived === "boolean" &&
			isArchived !== project.isArchived
		) {
			project.isArchived = isArchived;

			project.activityLog.push({
				action: isArchived ? "project_archived" : "project_unarchived",
				user: updatedBy,
				timestamp: new Date(),
			});
		}

		const updatedProject = await project.save();

		await updatedProject.populate("members.user", "username avatar");

		sendWebSocketMessage("PROJECT_UPDATED", { project: updatedProject });

		res.status(200).json(updatedProject);
	} catch (error) {
		next(error);
	}
};

export const deleteProject: RequestHandler = async (req, res, next) => {
	try {
		const projectId = req.params.projectId;

		if (!projectId) {
			throw createHttpError(400, "No project found");
		}

		const project = await findProjectById(projectId);

		const userHasAccess = project?.createdBy._id.equals(req.user._id);

		if (!userHasAccess) {
			throw createHttpError(403, "You do not have access");
		}

		await project?.deleteOne();

		sendWebSocketMessage("PROJECT_DELETED", { projectId });

		res.status(200).json({ message: "Project deleted successfully" });
	} catch (error) {
		next(error);
	}
};

type AddMemberBody = {
	userId: string;
	role?: "admin" | "developer" | "guest";
};

export const addMemberToProject: RequestHandler<
	{ id: string },
	unknown,
	AddMemberBody,
	unknown
> = async (req, res, next) => {
	try {
		const projectId = req.params.id;
		const { userId, role } = req.body;

		if (!userId) {
			throw createHttpError(400, "User ID is required");
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw createHttpError(400, "Invalid User ID");
		}

		const project = await findProjectById(projectId);

		const userHasAccess =
			project.createdBy.equals(req.user.id) ||
			project.members.some(
				(member) =>
					member.user.equals(req.user.id) && member.role === "admin"
			);

		if (!userHasAccess) {
			throw createHttpError(
				403,
				"You do not have permission to add members to this project"
			);
		}

		const user = await User.findById(userId);

		if (!user) {
			throw createHttpError(404, "User not found");
		}

		const isAlreadyMember = project.members.some((member) =>
			member.user.equals(userId)
		);

		if (isAlreadyMember) {
			throw createHttpError(
				400,
				"User is already a member of this project"
			);
		}

		if (!role) {
			throw createHttpError(400, "Role is required to add a mamber");
		}

		project.members.push({ user: userId, role });

		project.activityLog.push({
			action: "member_added",
			user: req.user._id,
			timestamp: new Date(),
		});

		await project.save();

		sendWebSocketMessage("PROJECT_MEMBER_ADDED", { project });

		res.status(200).json(project);
	} catch (error) {
		next(error);
	}
};

type RemoveMemberBody = {
	userId: string;
};

export const removeMemberFromProject: RequestHandler<
	{ id: string },
	unknown,
	RemoveMemberBody,
	unknown
> = async (req, res, next) => {
	try {
		const projectId = req.params.id;

		const { userId } = req.body;

		if (!userId) {
			throw createHttpError(400, "User ID is required");
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw createHttpError(400, "Invalid User ID");
		}

		const project = await findProjectById(projectId);

		const userHasAccess =
			project.createdBy.equals(req.user.id) ||
			project.members.some(
				(member) =>
					member.user.equals(req.user.id) && member.role === "admin"
			);

		if (!userHasAccess) {
			throw createHttpError(
				401,
				"You do not have permission to remove members from this project"
			);
		}

		const memberIndex = project.members.findIndex((member) =>
			member.user.equals(userId)
		);

		if (memberIndex === -1) {
			throw createHttpError(400, "User is not a member of this project");
		}

		project.members.splice(memberIndex, 1);

		project.activityLog.push({
			action: "member_removed",
			user: req.user._id,
			timestamp: new Date(),
		});

		await project.save();

		sendWebSocketMessage("PROJECT_MEMBER_REMOVED", { project });

		res.status(200).json(project);
	} catch (error) {
		next(error);
	}
};
