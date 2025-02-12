import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setAccessToken } from "./authSlice";
import { userApi } from "../api/userApi";
import api from "../api/api";
import WebSocketService from "../api/websocket";

WebSocketService.connect();

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

const websocketEvents = {
	TASK_CREATED: "Tasks",
	TASK_UPDATED: "Tasks",
	TASK_DELETED: "Tasks",
	TASK_ASSIGNED: "Tasks",
	TASK_STATUS_UPDATED: "Tasks",
	PROJECT_CREATED: "Projects",
	PROJECT_UPDATED: "Projects",
	PROJECT_DELETED: "Projects",
	PROJECT_MEMBER_ADDED: "Projects",
	PROJECT_MEMBER_REMOVED: "Projects",
} as const;

Object.entries(websocketEvents).forEach(([event, tag]) => {
	WebSocketService.on(event, () =>
		store.dispatch(api.util.invalidateTags([tag]))
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
