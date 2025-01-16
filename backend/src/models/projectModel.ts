import { InferSchemaType, model, Schema } from "mongoose";

const projectSchema = new Schema(
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
			enum: ["active", "completed", "archived"],
			default: "active",
			index: true,
		},
		members: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				role: {
					type: String,
					enum: ["admin", "editor", "viewer"],
					default: "viewer",
				},
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		dueDate: {
			type: Date,
			validate: {
				validator: function (value: Date) {
					return value >= new Date();
				},
				message: "Due date cannot be in the past",
			},
		},
		activityLog: {
			type: [
				{
					action: {
						type: String,
						enum: [
							"project_created",
							"task_added",
							"status_updated",
							"member_added",
							"member_removed",
						],
						required: true,
					},
					userId: {
						type: Schema.Types.ObjectId,
						ref: "User",
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

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>("Project", projectSchema);
