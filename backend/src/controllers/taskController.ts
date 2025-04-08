import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Task from "../models/taskModel";
import { isUserPartOfProject } from "../../utils/isUserPartOfProject";
import mongoose from "mongoose";
import { sendWebSocketMessage } from "../service/websocketService";

const findTaskById = async (taskId: string) => {
	const task = await Task.findById(taskId);
	if (!task) throw createHttpError(404, "Task not found");
	return task;
};

type CreateTaskBody = {
	title: string;
	description?: string;
	status?: "To Do" | "In Progress" | "Done";
	assignedTo?: string[];
	dueDate?: string;
	priority?: "Low" | "Medium" | "High";
};

export const createTask: RequestHandler<
	{ projectId: string },
	unknown,
	CreateTaskBody,
	unknown
> = async (req, res, next) => {
	try {
		const { title, description, status, assignedTo, dueDate, priority } =
			req.body;

		const projectId = req.params.projectId;
		const userId = req?.user?.id;

		if (!userId) {
			throw createHttpError(
				403,
				"You must be authenticated to create a task"
			);
		}

		const { member } = await isUserPartOfProject(userId, projectId);

		if (member && !["admin", "developer"].includes(member.role)) {
			throw createHttpError(
				403,
				"You do not have permission to create tasks"
			);
		}

		if (!title) {
			throw createHttpError(400, "Title is required");
		}

		const existingTask = await Task.findOne({
			projectId,
			title: { $regex: `^${title}$`, $options: "i" },
		});

		if (existingTask) {
			throw createHttpError(
				409,
				"A task with the same title already exists in this project"
			);
		}

		const taskData = {
			title,
			description,
			status,
			assignedTo,
			projectId,
			dueDate: dueDate ? new Date(dueDate) : undefined,
			priority,
			activityLog: [
				{
					action: "task_created",
					userId: userId,
					timestamp: new Date(),
				},
			],
		};

		if (taskData.dueDate && taskData.dueDate < new Date()) {
			throw createHttpError(400, "Due date cannot be in the past");
		}

		const newTask = await Task.create(taskData);

		sendWebSocketMessage("TASK_CREATED", { task: newTask });
		res.status(201).json(newTask);
	} catch (error) {
		next(error);
	}
};

export const getTasks: RequestHandler = async (req, res, next) => {
	try {
		const userId = req?.user?.id;

		if (!userId) {
			throw createHttpError(401, "Not authorized");
		}

		const projectId = req.params.projectId;

		await isUserPartOfProject(userId, projectId);

		const tasks = await Task.find({ projectId });

		res.status(200).json(tasks);
	} catch (error) {
		next(error);
	}
};

export const getTask: RequestHandler = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const task = await findTaskById(taskId);

		await isUserPartOfProject(req.user.id, task.projectId.toString());

		res.status(200).json(task);
	} catch (error) {
		next(error);
	}
};

export const updateTask: RequestHandler = async (req, res, next) => {
	try {
		const { title, description, dueDate, priority, status } = req.body;
		const { taskId } = req.params;
		const updatedBy = req?.user?.id;

		if (!updatedBy) {
			throw createHttpError(
				403,
				"You must be authenticated to update a project"
			);
		}

		const task = await findTaskById(taskId);

		await isUserPartOfProject(updatedBy, task.projectId.toString());

		if (title) task.title = title;
		if (description) task.description = description;
		if (dueDate) task.dueDate = new Date(dueDate);
		if (priority) task.priority = priority;
		if (status && task.status !== status) task.status = status;

		task.activityLog.push({
			action: "task_updated",
			userId: updatedBy,
			timestamp: new Date(),
		});

		const updatedTask = await task.save();

		sendWebSocketMessage("TASK_UPDATED", { task: updatedTask });
		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};

export const deleteTask: RequestHandler = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const userId = req?.user?.id;

		if (!userId) throw createHttpError(403, "Authentication required");

		const task = await findTaskById(taskId);

		await isUserPartOfProject(userId, task.projectId.toString());

		await task?.deleteOne();

		sendWebSocketMessage("TASK_DELETED", { taskId });
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const assignUsersToTask: RequestHandler = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { userIds } = req.body;
		const updatedBy = req?.user?.id;

		if (!updatedBy) {
			throw createHttpError(401, "Not authorized");
		}

		if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
			throw createHttpError(400, "User IDs are required");
		}

		if (!userIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
			throw createHttpError(400, "Invalid User ID(s) provided");
		}

		const task = await findTaskById(taskId);
		const projectId = task.projectId.toString();

		const { member, project } = await isUserPartOfProject(
			updatedBy,
			projectId
		);

		if (
			project.createdBy.toString() !== updatedBy &&
			(!member || !["admin", "developer"].includes(member.role))
		) {
			throw createHttpError(
				403,
				"You do not have permission to assign tasks"
			);
		}

		const invalidUserIds: string[] = [];

		for (const userId of userIds) {
			const userInProject = project.members.some(
				(member) => member.user.toString() === userId
			);

			if (!userInProject) {
				invalidUserIds.push(userId);
			}
		}

		if (invalidUserIds.length > 0) {
			throw createHttpError(
				400,
				`User(s) with ID(s) ${invalidUserIds.join(
					", "
				)} cannot be assigned to this task because they are not part of the project.`
			);
		}

		const existingUsers = task.assignedTo || [];

		const alreadyAssigned = userIds.filter((userId) =>
			existingUsers.includes(userId)
		);

		if (alreadyAssigned.length > 0) {
			throw createHttpError(
				400,
				`User(s) with ID(s) ${alreadyAssigned.join(
					", "
				)} are already assigned to this task.`
			);
		}

		task.assignedTo.push(...userIds);

		task.activityLog.push({
			action: "assigned_to_task",
			userId: updatedBy,
			timestamp: new Date(),
		});

		const updatedTask = await task.save();

		sendWebSocketMessage("TASK_ASSIGNED", { task: updatedTask });

		res.status(200).json({
			message: "Users successfully assigned to the task",
			assignedUsers: task.assignedTo,
		});
	} catch (error) {
		next(error);
	}
};

export const updateTaskStatus: RequestHandler = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { status } = req.body;
		const updatedBy = req?.user?.id;

		const task = await Task.findById(taskId);

		if (!task) {
			throw createHttpError(404, "Task not found");
		}

		if (!status || !["To Do", "In Progress", "Done"].includes(status)) {
			throw createHttpError(400, "Invalid status value");
		}

		if (!updatedBy) {
			throw createHttpError(401, "Not authorized");
		}

		if (task.status === status) {
			res.status(200).json({
				message: "Status is already up-to-date",
				task,
			});

			return;
		}

		const projectId = task.projectId.toString();

		const { member, project } = await isUserPartOfProject(
			updatedBy,
			projectId
		);

		if (
			project.createdBy.toString() !== updatedBy &&
			(!member || !["admin", "developer"].includes(member.role))
		) {
			throw createHttpError(
				403,
				"You do not have permission to update task status"
			);
		}

		task.status = status;

		task.activityLog.push({
			action: "status_updated",
			userId: updatedBy,
			timestamp: new Date(),
		});

		const updatedTask = await task.save();

		sendWebSocketMessage("TASK_STATUS_UPDATED", { task: updatedTask });

		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};
