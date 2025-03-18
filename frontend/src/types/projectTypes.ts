export type Role = "admin" | "developer" | "guest";

export interface ProjectMember {
	userId: { _id: string; username: string };
	role?: Role;
}

export interface CreateProjectRequest {
	title: string;
	description?: string;
	status?: "active" | "completed" | "archived";
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
	status?: "active" | "completed" | "archived";
	tags?: string[];
	dueDate: string;
	members?: ProjectMember[];
}

export interface DetailedProject extends Project {
	description?: string;
	createdBy: {
		_id: string;
		username: string;
		avatar: string;
		role: string;
	};
	activityLog: {
		action: string;
		userId: {
			_id: string;
		};
		timestamp: string;
		_id: string;
	}[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}
