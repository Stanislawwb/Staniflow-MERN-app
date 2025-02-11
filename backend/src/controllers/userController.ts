import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel, { UserDocument } from "../models/userModel";
import { generateRefreshToken, generateToken } from "../util/tokenUtils";

type createUserBody = {
	username: string;
	email: string;
	password: string;
};

export const createUser: RequestHandler<
	unknown,
	unknown,
	createUserBody,
	unknown
> = async (req, res, next) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) {
			throw createHttpError(400, "Parameters missing");
		}

		const existingUsername = await UserModel.findOne({ username });

		if (existingUsername) {
			throw createHttpError(409, "Username already taken.");
		}

		const existingEmail = await UserModel.findOne({
			email: email,
		});

		if (existingEmail) {
			throw createHttpError(409, "Email already taken.");
		}

		const newUser: UserDocument = await UserModel.create({
			username,
			email,
			password,
		});

		const accessToken = generateToken(newUser._id.toString());
		const refreshToken = generateRefreshToken(newUser._id.toString());

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({
			user: {
				_id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

type loginBody = {
	email?: string;
	password?: string;
};

export const login: RequestHandler<
	unknown,
	unknown,
	loginBody,
	unknown
> = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw createHttpError(400, "Parameters missing");
		}

		const user = await UserModel.findOne({ email: email }).select(
			"+password"
		);

		if (!user) {
			throw createHttpError(401, "Invalid credentials");
		}

		const passwordMatch = await user.comparePassword(password);

		if (!passwordMatch) {
			throw createHttpError(401, "Invalid credentials");
		}

		const accessToken = generateToken(user._id.toString());
		const refreshToken = generateRefreshToken(user._id.toString());

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			user: {
				_id: user.id,
				username: user.username,
				email: user.email,
			},
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

export const logout: RequestHandler = async (req, res, next) => {
	try {
		res.clearCookie("refreshToken");
		res.status(200).json({ message: "Successfully logged out" });
	} catch (error) {
		next(error);
	}
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
	try {
		const users = await UserModel.find({}, "username email").lean();

		res.json(users);
	} catch (error) {
		next(error);
	}
};

export const getMe: RequestHandler = async (req, res, next) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		next(error);
	}
};
