import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Project from "../models/projectModel";
import User from "../models/userModel";
import mongoose from "mongoose";
import { sendWebSocketMessage } from "../service/websocketService";

const findProjectById = async (projectId: string) => {
	const project = await Project.findById(projectId);
	if (!project) throw createHttpError(404, "Project not found");
	return project;
};

type CreateProjectBody = {
	title: string;
	description?: string;
	status?: "active" | "completed" | "archived";
	members?: {
		userId: string;
		role?: "admin" | "editor" | "viewer";
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
		const { title, description, status, members, tags, dueDate } = req.body;

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
			status,
			members,
			tags,
			dueDate,
			createdBy,
			activityLog: [
				{
					action: "project_created",
					userId: createdBy,
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
		const projects = await Project.find({
			$or: [
				{ createdBy: req.user._id },
				{ "members.userId": req.user._id },
			],
		}).select("title status tags dueDate members");

		res.status(200).json(projects);
	} catch (error) {
		next(error);
	}
};

export const getProject: RequestHandler = async (req, res, next) => {
	try {
		const projectId = req.params.id;

		if (!projectId) {
			throw createHttpError(400, "Project ID is required");
		}

		const project = await Project.findById(projectId)
			.populate("createdBy", "name avatar role")
			.populate("activityLog.userId", "name");

		if (!project) {
			throw createHttpError(404, "Project not found");
		}

		const userHasAccess =
			project.createdBy._id.equals(req.user._id) ||
			project.members.some((member) =>
				member.userId._id.equals(req.user._id)
			);

		if (!userHasAccess) {
			throw createHttpError(
				403,
				"You do not have access to this project"
			);
		}

		res.status(200).json(project);
	} catch (error) {
		next(error);
	}
};

type UpdateProjectParams = {
	id: string;
};

type UpdateProjectBody = {
	title: string;
	description?: string;
	status?: "active" | "completed" | "archived";
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
		const projectId = req.params.id;

		const { title, description, status, tags, dueDate } = req.body;

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
			project.members.some((member) => member.userId.equals(updatedBy));

		if (!userHasAccess) {
			throw createHttpError(
				403,
				"You do not have permission to update this project"
			);
		}

		if (dueDate) {
			project.dueDate = new Date(dueDate);
		}

		if (title) project.title = title;
		if (description) project.description = description;
		if (status) project.status = status;
		if (tags) project.tags = tags;

		project.activityLog.push({
			action: "project_updated",
			userId: updatedBy,
			timestamp: new Date(),
		});

		const updatedProject = await project.save();

		sendWebSocketMessage("PROJECT_UPDATED", { project: updatedProject });

		res.status(200).json(updatedProject);
	} catch (error) {
		next(error);
	}
};

export const deleteProject: RequestHandler = async (req, res, next) => {
	try {
		const projectId = req.params.id;

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
					member.userId.equals(req.user.id) && member.role === "admin"
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
			member.userId.equals(userId)
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

		project.members.push({ userId, role });

		project.activityLog.push({
			action: "member_added",
			userId: req.user._id,
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
					member.userId.equals(req.user.id) && member.role === "admin"
			);

		if (!userHasAccess) {
			throw createHttpError(
				401,
				"You do not have permission to remove members from this project"
			);
		}

		const memberIndex = project.members.findIndex((member) =>
			member.userId.equals(userId)
		);

		if (memberIndex === -1) {
			throw createHttpError(400, "User is not a member of this project");
		}

		project.members.splice(memberIndex, 1);

		project.activityLog.push({
			action: "member_removed",
			userId: req.user._id,
			timestamp: new Date(),
		});

		await project.save();

		sendWebSocketMessage("PROJECT_MEMBER_REMOVED", { project });

		res.status(200).json(project);
	} catch (error) {
		next(error);
	}
};
