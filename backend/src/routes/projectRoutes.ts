import express from "express";
import * as ProjectController from "../controllers/projectController";
import * as TaskController from "../controllers/taskController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router
	.route("/")
	.post(protect, ProjectController.createProject)
	.get(protect, ProjectController.getProjects);

router
	.route("/:projectId")
	.get(protect, ProjectController.getProject)
	.delete(protect, ProjectController.deleteProject)
	.patch(protect, ProjectController.updateProject);

router
	.route("/:id/members")
	.patch(protect, ProjectController.addMemberToProject)
	.delete(protect, ProjectController.removeMemberFromProject);

// Tasks Routes
router
	.route("/:projectId/tasks")
	.post(protect, TaskController.createTask)
	.get(protect, TaskController.getTasks);

router
	.route("/tasks/:taskId")
	.get(protect, TaskController.getTask)
	.patch(protect, TaskController.updateTask)
	.delete(protect, TaskController.deleteTask);

router
	.route("/tasks/:taskId/assign")
	.patch(protect, TaskController.assignUsersToTask);

export default router;
