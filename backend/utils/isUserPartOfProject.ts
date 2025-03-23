import createHttpError from "http-errors";
import Project, { ProjectDocument } from "../src/models/projectModel";

export interface Member {
	userId: string;
	role: "admin" | "developer" | "guest";
}

export interface IsUserPartOfProjectResult {
	project: ProjectDocument;
	member?: Member;
}

export const isUserPartOfProject = async (
	userId: string,
	projectId: string
): Promise<IsUserPartOfProjectResult> => {
	const project = (await Project.findById(
		projectId
	).lean()) as ProjectDocument;

	if (!project) {
		throw createHttpError(404, "Project not found");
	}

	const member = project.members.find(
		(member) => member.user.toString() === userId.toString()
	);

	if (!member && project.createdBy.toString() !== userId.toString()) {
		throw createHttpError(403, "You are not a member of this project");
	}

	const formattedMember = member
		? {
				userId: member.user.toString(),
				role: member.role,
		  }
		: undefined;

	return { project, member: formattedMember };
};
