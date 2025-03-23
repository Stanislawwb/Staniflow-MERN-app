import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api";
import { userApi } from "../api/userApi";
import WebSocketService from "../api/websocket";
import authReducer, { setAccessToken } from "./authSlice";
import projectCreateModalReducer from "./projectCreateModalSlice";

WebSocketService.connect();

export const store = configureStore({
	reducer: {
		auth: authReducer,
		projectCreateModal: projectCreateModalReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

const websocketEvents: Record<string, ("Projects" | "Tasks")[]> = {
	TASK_CREATED: ["Tasks", "Projects"],
	TASK_UPDATED: ["Tasks", "Projects"],
	TASK_DELETED: ["Tasks", "Projects"],
	TASK_ASSIGNED: ["Tasks", "Projects"],
	TASK_STATUS_UPDATED: ["Tasks", "Projects"],

	PROJECT_CREATED: ["Projects"],
	PROJECT_UPDATED: ["Projects"],
	PROJECT_DELETED: ["Projects"],
	PROJECT_MEMBER_ADDED: ["Projects"],
	PROJECT_MEMBER_REMOVED: ["Projects"],
} as const;

Object.entries(websocketEvents).forEach(([event, tags]) => {
	WebSocketService.on(event, () =>
		store.dispatch(api.util.invalidateTags(tags))
	);
});

WebSocketService.on("disconnect", () => {
	console.warn("WebSocket Disconnected! Data might be outdated.");
});

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
