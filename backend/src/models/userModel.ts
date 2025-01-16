import { HydratedDocument, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface ValidationProps {
	value: string;
}

interface IUser {
	username: string;
	email: string;
	password: string;
	avatar?: string;
	projects: Schema.Types.ObjectId[];
	role: "admin" | "member";
}

interface IUserDocument extends IUser, Document {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		select: false,
		validate: {
			validator: function (v: string) {
				return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
					v
				);
			},
			message: (props: ValidationProps) =>
				`${props.value} not a valid email address!`,
		},
	},
	password: {
		type: String,
		required: true,
		select: false,
		minLength: 6,
		validate: {
			validator: function (v: string) {
				return /[A-Z]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v);
			},
			message: `Password must contain at least one uppercase letter and at least one special character`,
		},
	},
	avatar: {
		type: String,
		default: "default-avatar.png",
	},
	projects: [
		{
			type: Schema.Types.ObjectId,
			ref: "Project",
		},
	],
	role: {
		type: String,
		enum: ["admin", "member"],
		default: "member",
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const saltRounds = 10;

		this.password = await bcrypt.hash(this.password, saltRounds);

		next();
	} catch (error) {
		if (error instanceof Error) {
			next(error);
		} else {
			next(
				new Error("An unknown error occurred during password hashing")
			);
		}
	}
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export type UserDocument = HydratedDocument<IUserDocument>;

export default model<IUserDocument>("User", userSchema);
