import { InferSchemaType, model, Schema } from "mongoose";

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["To Do", "In Progress", "Done"],
			default: "To Do",
			required: true,
			index: true,
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
			index: true,
		},
		assignedTo: [
			{
				type: [Schema.Types.ObjectId],
				ref: "User",
				default: [],
			},
		],
		dueDate: {
			type: Date,
			validate: {
				validator: function (value: Date) {
					return value >= new Date();
				},
				message: "Due date cannot be in the past",
			},
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High"],
			default: "Medium",
		},
	},
	{
		timestamps: true,
	}
);

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);
