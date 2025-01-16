import express from "express";
import * as UserController from "../controllers/userController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, UserController.getAllUsers);
router.get("/me", protect, UserController.getMe);
router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout); // delete the token from the client

export default router;
