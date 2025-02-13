type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "To Do" | "In Progress" | "Done";

interface TaskActivity {
	action:
		| "task_created"
		| "task_updated"
		| "assigned_to_task"
		| "task_deleted"
		| "status_updated";
	userId: string;
	timestamp: string;
}

interface Task {
	_id: string;
	title: string;
	description?: string;
	status?: TaskStatus;
	assignedTo?: string[];
	projectId: string;
	dueDate?: string;
	priority?: TaskPriority;
	activityLog: TaskActivity;
}

export interface CreateTaskRequest {
	title: string;
	description?: string;
	status?: TaskStatus;
	assignedTo?: string[];
	dueDate?: string;
	priority?: TaskPriority;
}

export interface CreateTaskResponse extends Task {}

export interface GetTasksResponse extends Array<Task> {}

export interface GetTaskResponse extends Task {}

export interface DeleteTaskResponse {
	message: string;
}

export interface AssignUsersToTaskResponse {
	message: string;
	assignedUsers: string[];
}

export interface UpdateTaskStatusResponse extends Task {}
