// src/api/websocketHandlers.ts
import WebSocketService from "./websocket";
import { store } from "../store/store";
import { taskApi } from "./taskApi";
import { api } from "./api";
import { Task } from "../types/taskTypes";

// RTK Query cache invalidation per event
const websocketEvents: Record<string, ("Projects" | "Tasks")[]> = {
	TASK_CREATED: ["Tasks", "Projects"],
	TASK_UPDATED: ["Tasks", "Projects"],
	TASK_DELETED: ["Tasks", "Projects"],
	TASK_ASSIGNED: ["Tasks", "Projects"],
	TASK_REORDERED: ["Tasks", "Projects"],
	PROJECT_CREATED: ["Projects"],
	PROJECT_UPDATED: ["Projects"],
	PROJECT_DELETED: ["Projects"],
	PROJECT_MEMBER_ADDED: ["Projects"],
	PROJECT_MEMBER_REMOVED: ["Projects"],
};

export const setupWebSocketHandlers = () => {
	WebSocketService.connect();

	// Invalidate cache on WebSocket events
	Object.entries(websocketEvents).forEach(([event, tags]) => {
		WebSocketService.on(event, () => {
			store.dispatch(api.util.invalidateTags(tags));
		});
	});

	// Optimistic update of task order
	WebSocketService.on("TASK_REORDERED", ({ projectId, updatedTasks }) => {
		store.dispatch(
			taskApi.util.updateQueryData(
				"getTasks",
				{ projectId },
				(draft: Task[]) => {
					updatedTasks.forEach(
						(u: {
							taskId: string;
							status: string;
							order: number;
						}) => {
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

	// Disconnection warning
	WebSocketService.on("disconnect", () => {
		console.warn("WebSocket Disconnected! Data might be outdated.");
	});
};
