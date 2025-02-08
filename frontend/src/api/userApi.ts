import api from "./api";
import {
	IUser,
	IUserRegisterRequest,
	IUserLoginRequest,
	IUserResponse,
	IUsersResponse,
} from "../types/userTypes";
import { setAccessToken } from "../store/authSlice";

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		registerUser: builder.mutation<IUserResponse, IUserRegisterRequest>({
			query: (userData) => ({
				url: "/users/register",
				method: "POST",
				body: userData,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setAccessToken(data.accessToken));
				} catch (error) {
					console.error("Login failed:", error);
				}
			},
		}),
		loginUser: builder.mutation<IUserResponse, IUserLoginRequest>({
			query: (credentials) => ({
				url: "/users/login",
				method: "POST",
				body: credentials,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setAccessToken(data.accessToken));
				} catch (error) {
					console.error("Login failed:", error);
				}
			},
		}),
		refreshToken: builder.mutation<{ accessToken: string }, void>({
			query: () => ({
				url: "/users/refresh-token",
				method: "POST",
				credentials: "include",
			}),
		}),
		logoutUser: builder.mutation<{ message: string }, void>({
			query: () => ({
				url: "/users/logout",
				method: "POST",
			}),
		}),
		getUsers: builder.query<IUsersResponse[], void>({
			query: () => ({
				url: "/users/",
			}),
		}),
		getMe: builder.query<IUser, void>({
			query: () => ({
				url: "/users/me",
			}),
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useLoginUserMutation,
	useLogoutUserMutation,
	useGetUsersQuery,
	useGetMeQuery,
} = userApi;
