import { InferSchemaType, model, Schema, Document } from "mongoose";

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
			default: "",
		},
		status: {
			type: String,
			enum: ["In Progress", "Completed"],
			default: "In Progress",
			index: true,
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
		members: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				role: {
					type: String,
					enum: ["admin", "developer", "guest"],
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
			required: true,
		},
		activityLog: {
			type: [
				{
					action: {
						type: String,
						enum: [
							"project_created",
							"project_updated",
							"status_updated",
							"project_archived",
							"project_unarchived",
							"member_added",
							"member_removed",
						],
						required: true,
					},
					status: {
						type: String,
						enum: ["In Progress", "Completed"],
					},
					user: {
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

export type ProjectDocument = Project & Document;

export default model<ProjectDocument>("Project", projectSchema);
