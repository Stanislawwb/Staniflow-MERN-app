import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.login);

export default router;
