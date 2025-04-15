export type Role = "admin" | "developer" | "guest";

export interface ProjectActivity {
	_id: string;
	action:
		| "project_created"
		| "project_updated"
		| "project_deleted"
		| "project_member_added"
		| "project_member_removed"
		| "archived_project";
	user: {
		_id: string;
		username: string;
	};
	timestamp: string;
}

export interface ProjectMember {
	user: {
		_id: string;
		username: string;
		avatar: string;
	};
	role?: Role;
}

export interface ProjectMemberInput {
	userId: string;
	role?: Role;
}

export interface CreateProjectRequest {
	title: string;
	description?: string;
	status?: "In Progress" | "Completed" | "Archived";
	members?: ProjectMember[];
	tags?: string[];
	dueDate?: string;
}

export interface CreateProjectSubmitData {
	title: string;
	description?: string;
	status?: "In Progress" | "Completed" | "Archived";
	members?: ProjectMemberInput[];
	tags?: string[];
	dueDate?: string;
}

export interface CreateProjectResponse extends CreateProjectRequest {
	_id: string;
	createdBy: string;
	activityLog: {
		action: string;
		userId: string;
		timestamp: string;
	}[];
	createdAt: string;
	updatedAt: string;
}

export interface Project {
	_id: string;
	title: string;
	status?: "In Progress" | "Completed" | "Archived";
	tags?: string[];
	dueDate: string;
	members?: ProjectMember[];
}

export interface DetailedProject extends Project {
	description?: string;
	tasksCount: number;
	completedTasksCount: number;
	createdBy: {
		_id: string;
		username: string;
		avatar: string;
		role: string;
	};
	activityLog: {
		action: string;
		user: {
			_id: string;
		};
		timestamp: string;
		_id: string;
	}[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}
