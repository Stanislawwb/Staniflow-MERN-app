import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { generateToken } from "../util/tokenUtils";

export const refreshToken: RequestHandler = (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return next(createHttpError(401, "No refresh token provided"));
	}

	if (!process.env.JWT_REFRESH_SECRET) {
		console.error("JWT_REFRESH_SECRET is not defined");
		return next(
			createHttpError(500, "JWT secret is not set on the server")
		);
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as { id: string };

		const newAccessToken = generateToken(decoded.id);

		res.json({ accessToken: newAccessToken });
	} catch (error) {
		console.error(error);
		res.clearCookie("refreshToken");
		return next(createHttpError(403, "Invalid refresh token"));
	}
};
