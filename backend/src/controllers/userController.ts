import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

		const existingUsername = await UserModel.findOne({
			username: username,
		});

		if (existingUsername) {
			throw createHttpError(409, "Username already taken.");
		}

		const existingEmail = await UserModel.findOne({
			email: email,
		});

		if (existingEmail) {
			throw createHttpError(409, "Email already taken.");
		}

		const passwordHashed = await bcrypt.hash(password, 10);

		const newUser = await UserModel.create({
			username: username,
			email: email,
			password: passwordHashed,
		});

		res.status(201).json({
			_id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			token: generateToken(newUser._id.toString()),
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

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw createHttpError(401, "Invalid credentials");
		}

		res.json({
			_id: user.id,
			name: user.username,
			email: user.email,
			token: generateToken(user._id.toString()),
		});
	} catch (error) {
		next(error);
	}
};

const generateToken = (id: string) => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "2h",
	});
};
