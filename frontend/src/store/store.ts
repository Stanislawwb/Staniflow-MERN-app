import { configureStore } from "@reduxjs/toolkit";

import authReducer, { setAccessToken } from "./authSlice";
import { userApi } from "../api/userApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[userApi.reducerPath]: userApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(userApi.middleware),
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
