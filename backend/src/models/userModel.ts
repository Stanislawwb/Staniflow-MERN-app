import { InferSchemaType, model, Schema } from "mongoose";

interface ValidationProps {
	value: string;
}

const userModel = new Schema({
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
});

type User = InferSchemaType<typeof userModel>;

export default model<User>("User", userModel);
