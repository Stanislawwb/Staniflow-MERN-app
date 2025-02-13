import {
	AssignUsersToTaskResponse,
	CreateTaskRequest,
	CreateTaskResponse,
	GetTaskResponse,
	GetTasksResponse,
	TaskStatus,
	UpdateTaskStatusResponse,
} from "../types/taskTypes";
import api from "./api";

export const taskApi = api.injectEndpoints({
	endpoints: (builder) => ({
		createTask: builder.mutation<
			CreateTaskResponse,
			{ projectId: string; data: CreateTaskRequest }
		>({
			query: ({ projectId, data }) => ({
				url: `/projects/${projectId}/tasks`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: [{ type: "Tasks", id: "LIST" }],
		}),
		getTasks: builder.query<GetTasksResponse, { projectId: string }>({
			query: ({ projectId }) => ({
				url: `/projects/${projectId}/tasks`,
			}),
			providesTags: (result) =>
				result
					? [
							{ type: "Tasks", id: "LIST" },
							...result.map(({ _id }) => ({
								type: "Tasks" as const,
								id: _id,
							})),
					  ]
					: ["Tasks"],
		}),
		getTask: builder.query<GetTaskResponse, string>({
			query: (taskId) => ({
				url: `/projects/tasks/${taskId}`,
			}),
			providesTags: (_, __, taskId) => [{ type: "Tasks", id: taskId }],
		}),
		updateTask: builder.mutation<
			CreateTaskResponse,
			{ taskId: string; data: Partial<CreateTaskRequest> }
		>({
			query: ({ taskId, data }) => ({
				url: `/projects/tasks/${taskId}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_, __, { taskId }) => [
				{ type: "Tasks", id: taskId },
			],
		}),
		deleteTask: builder.mutation<{ message: string }, string>({
			query: (taskId) => ({
				url: `/projects/tasks/${taskId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "Tasks", id: "LIST" }],
		}),
		assignUsersToTask: builder.mutation<
			AssignUsersToTaskResponse,
			{ taskId: string; userIds: string[] }
		>({
			query: ({ taskId, userIds }) => ({
				url: `/projects/tasks/${taskId}/assign`,
				method: "PATCH",
				body: { userIds },
			}),
			invalidatesTags: (_, __, { taskId }) => [
				{ type: "Tasks", id: taskId },
			],
		}),
		updateTaskStatus: builder.mutation<
			UpdateTaskStatusResponse,
			{ taskId: string; status: TaskStatus }
		>({
			query: ({ taskId, status }) => ({
				url: `/projects/tasks/${taskId}/status`,
				method: "PATCH",
				body: { status },
			}),
			invalidatesTags: (_, __, { taskId }) => [
				{ type: "Tasks", id: taskId },
			],
		}),
	}),
});

export const {
	useCreateTaskMutation,
	useGetTasksQuery,
	useGetTaskQuery,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useAssignUsersToTaskMutation,
	useUpdateTaskStatusMutation,
} = taskApi;
