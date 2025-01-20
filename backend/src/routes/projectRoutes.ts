import express from "express";
import * as ProjectController from "../controllers/projectController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router
	.route("/")
	.post(protect, ProjectController.createProject)
	.get(protect, ProjectController.getProjects);

router
	.route("/:id")
	.get(protect, ProjectController.getProject)
	.delete(protect, ProjectController.deleteProject)
	.patch(protect, ProjectController.updateProject);

router
	.route("/:id/members")
	.patch(protect, ProjectController.addMemberToProject)
	.delete(protect, ProjectController.removeMemberFromProject);

export default router;
