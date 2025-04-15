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
		order: {
			type: Number,
			required: true,
			default: 0,
			index: true,
		},
		activityLog: {
			type: [
				{
					action: {
						type: String,
						enum: [
							"task_created",
							"task_updated",
							"status_updated",
							"assigned_to_task",
						],
						required: true,
					},
					userId: {
						type: Schema.Types.ObjectId,
						ref: "User",
					},
					status: {
						type: String,
						enum: ["To Do", "In Progress", "Done"],
					},
					timestamp: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("Task", taskSchema);
