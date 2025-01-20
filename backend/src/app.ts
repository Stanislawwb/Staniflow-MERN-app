import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import createHttpError, { isHttpError } from "http-errors";
import mongoose from "mongoose";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(error);

	let errorMessage = "An unknown error occured";
	let statusCode = 500;

	if (isHttpError(error)) {
		statusCode = error.status;

		errorMessage = error.message;
	} else if (error instanceof mongoose.Error.ValidationError) {
		statusCode = 400;
		errorMessage = Object.values(error.errors)
			.map((err) => err.message)
			.join(", ");
	}

	res.status(statusCode).json({ error: errorMessage });
});

export default app;
