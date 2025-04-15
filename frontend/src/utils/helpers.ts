import { ProjectActivity } from "../types/projectTypes";

export const formatDate = (date: string) => {
	return new Date(date).toLocaleString("en-GB", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};

export const statusClassMap: { [key: string]: string } = {
	Completed: "status--green",
	"In Progress": "status--purple",
	Archived: "status--red",
};

export const formatProjectActivity = (log: ProjectActivity): string => {
	const username = log.user.username || "Unknown user";
	const time = new Date(log.timestamp).toLocaleString();

	switch (log.action) {
		case "project_created":
			return `${username} created the project on ${time}`;
		case "project_updated":
			return `${username} updated the project on ${time}`;
		case "project_deleted":
			return `${username} deleted the project on ${time}`;
		case "project_member_added":
			return `${username} assigned someone to the project on ${time}`;
		case "project_member_removed":
			return `${username} removed member from the project on ${time}`;
		case "archived_project":
			return `${username} archived the project on ${time}`;
		default:
			return `${username} did something on ${time}`;
	}
};
