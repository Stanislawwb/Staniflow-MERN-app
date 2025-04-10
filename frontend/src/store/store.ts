import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api";
import { taskApi } from "../api/taskApi";
import { userApi } from "../api/userApi";
import WebSocketService from "../api/websocket";
import { Task } from "../types/taskTypes";
import authReducer, { setAccessToken } from "./authSlice";
import modalReducer from "./modalSlice";

WebSocketService.connect();

export const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

// WebSocket events mapped to which RTK Query cache tags to invalidate
const websocketEvents: Record<string, ("Projects" | "Tasks")[]> = {
	TASK_CREATED: ["Tasks", "Projects"],
	TASK_UPDATED: ["Tasks", "Projects"],
	TASK_DELETED: ["Tasks", "Projects"],
	TASK_ASSIGNED: ["Tasks", "Projects"],

	PROJECT_CREATED: ["Projects"],
	PROJECT_UPDATED: ["Projects"],
	PROJECT_DELETED: ["Projects"],
	PROJECT_MEMBER_ADDED: ["Projects"],
	PROJECT_MEMBER_REMOVED: ["Projects"],
} as const;

// Automatically invalidate cache tags on WebSocket events
Object.entries(websocketEvents).forEach(([event, tags]) => {
	WebSocketService.on(event, () =>
		store.dispatch(api.util.invalidateTags(tags))
	);
});

// Handle real-time reorder updates without refetch
WebSocketService.on("TASK_REORDERED", ({ projectId, updatedTasks }) => {
	store.dispatch(
		taskApi.util.updateQueryData(
			"getTasks",
			{ projectId },
			(draft: Task[]) => {
				updatedTasks.forEach(
					(u: { taskId: string; status: string; order: number }) => {
						const task = draft.find((t) => t._id === u.taskId);
						if (task) {
							task.status = u.status as Task["status"];
							task.order = u.order;
						}
					}
				);
			}
		)
	);
});

WebSocketService.on("disconnect", () => {
	console.warn("WebSocket Disconnected! Data might be outdated.");
});

// Automatically refresh authentication on app start
const initAuth = async () => {
	try {
		const data = await store
			.dispatch(userApi.endpoints.refreshToken.initiate())
			.unwrap();

		if (data?.accessToken) {
			store.dispatch(setAccessToken(data.accessToken));
		}
	} catch {
		console.log("No valid refresh token found");
	}
};

initAuth();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
