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
				res.status(401);
				throw createHttpError(401, "Not authorized, no token");
			}

			//Verify token
			if (!process.env.JWT_SECRET) {
				return next(createHttpError(500, "JWT_SECRET is not defined"));
			}

			let decoded;

			try {
				decoded = jwt.verify(token, process.env.JWT_SECRET);
			} catch (error: unknown) {
				if (error instanceof Error) {
					if (error.name === "TokenExpiredError") {
						return next(createHttpError(401, "Token Expired"));
					}

					return next(createHttpError(401, "Invalid token"));
				}
			}

			const decodedPayload = decoded as { id: string };

			const user = await UserModel.findById(decodedPayload.id).select(
				"-password"
			);

			if (!user) {
				return next(
					createHttpError(401, "Not authorized, user not found")
				);
			}

			req.user = user;
			return next();
		}

		return next(createHttpError(401, "Not authorized, no token provided"));
	} catch (error) {
		return next(error);
	}
};

export default protect;
