import { InferSchemaType, model, Schema } from "mongoose";

const projectSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>("Project", projectSchema);
