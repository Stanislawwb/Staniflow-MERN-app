import { NextFunction, Request, Response } from "express";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const protect = async (req: Request, res: Response, next: NextFunction) => {
	let token: string | undefined;

	try {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			if (!token) {
				throw createHttpError(401, "Not authorized, no token");
			}

			//Verify token
			if (!process.env.JWT_SECRET) {
				return next(createHttpError(500, "JWT_SECRET is not defined"));
			}

			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!);

				req.user = await UserModel.findById(
					(decoded as { id: string }).id
				).select("-password");

				if (!req.user) {
					return next(createHttpError(401, "User not found"));
				}
				return next();
			} catch (error) {
				console.error(error);
				return next(createHttpError(401, "Invalid or expired token"));
			}
		}

		return next(createHttpError(401, "Not authorized, no token provided"));
	} catch (error) {
		return next(error);
	}
};

export default protect;
