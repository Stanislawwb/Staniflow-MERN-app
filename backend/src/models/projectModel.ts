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
					deafault: "viewer",
				},
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tags: [
			{
				type: String,
			},
		],
		dueDate: {
			type: Date,
		},
		activityLog: [
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
	},
	{
		timestamps: true,
	}
);

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>("Project", projectSchema);
