import { ProjectActivity } from "../types/projectTypes";
import { TaskActivity } from "../types/taskTypes";

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
		case "project_archived":
			return `${username} archived the project on ${time}`;
		case "project_unarchived":
			return `${username} unarchived the project on ${time}`;

		case "status_updated":
			switch (log.status) {
				case "Completed":
					return `${username} marked the project as Completed on ${time}`;
				case "In Progress":
					return `${username} set the project status back to In Progress on ${time}`;
				default:
					return `${username} updated the project status on ${time}`;
			}
		default:
			return `${username} did something on ${time}`;
	}
};

export const formatTaskActivity = (log: TaskActivity): string => {
	const user = log.user?.username || "Unknown user";
	const time = new Date(log.timestamp).toLocaleString();

	switch (log.action) {
		case "task_created":
			return `${user} created the task on ${time}`;
		case "task_updated":
			return `${user} updated the task details on ${time}`;
		case "assigned_to_task":
			return `${user} assigned users to the task on ${time}`;
		case "status_updated":
			switch (log.status) {
				case "Done":
					return `${user} marked the task as Done on ${time}`;
				case "In Progress":
					return `${user} started progress on the task on ${time}`;
				case "To Do":
					return `${user} moved the task back to To Do on ${time}`;
				default:
					return `${user} updated the task status on ${time}`;
			}
		default:
			return `${user} did something on ${time}`;
	}
};
