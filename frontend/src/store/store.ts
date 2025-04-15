import { configureStore } from "@reduxjs/toolkit";
import api from "../api/api";
import { userApi } from "../api/userApi";
import WebSocketService from "../api/websocket";
import { setupWebSocketHandlers } from "../api/websocketHandlers";
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

setupWebSocketHandlers();

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
