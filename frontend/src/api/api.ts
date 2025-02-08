import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { logout, setAccessToken } from "../store/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}

		return headers;
	},
	credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		console.log("Access token expired, trying to refresh...");

		const refreshResult = await baseQuery(
			"/users/refresh-token",
			api,
			extraOptions
		);

		if (
			refreshResult.data &&
			typeof refreshResult.data === "object" &&
			"accessToken" in refreshResult.data
		) {
			const { accessToken } = refreshResult.data as {
				accessToken: string;
			};

			api.dispatch(setAccessToken(accessToken));

			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}

	return result;
};

export const api = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});

export default api;
