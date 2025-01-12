import { InferSchemaType, model, Schema } from "mongoose";

interface ValidationProps {
	value: string;
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
		validate: {
			validator: function (v: string) {
				return /^(?=.*[A-Z])[A-Za-z]{6,}$/.test(v);
			},
			message:
				"Password must be at least 6 characters long and contain at least one uppercase letter, with no special characters!",
		},
	},
	avatar: {
		type: String,
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

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
