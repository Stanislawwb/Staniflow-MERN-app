export type Role = "admin" | "developer" | "guest";

export interface ProjectMember {
	user: { _id: string; username: string; avatar: string };
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
