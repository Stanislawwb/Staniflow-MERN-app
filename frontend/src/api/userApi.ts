import api from "./api";
import {
	User,
	UserRegisterRequest,
	UserLoginRequest,
	UserResponse,
	UsersResponse,
} from "../types/userTypes";
import { setAccessToken } from "../store/authSlice";

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		registerUser: builder.mutation<UserResponse, UserRegisterRequest>({
			query: (userData) => ({
				url: "/users/register",
				method: "POST",
				body: userData,
			}),
			invalidatesTags: ["Users"],
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setAccessToken(data.accessToken));
				} catch (error) {
					console.error("Login failed:", error);
				}
			},
		}),
		loginUser: builder.mutation<UserResponse, UserLoginRequest>({
			query: (credentials) => ({
				url: "/users/login",
				method: "POST",
				body: credentials,
			}),
			invalidatesTags: ["Users"],
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
			invalidatesTags: ["Users"],
		}),
		getUsers: builder.query<UsersResponse[], void>({
			query: () => ({
				url: "/users/",
			}),
			providesTags: ["Users"],
		}),
		getMe: builder.query<User, void>({
			query: () => ({
				url: "/users/me",
			}),
			providesTags: ["UserMe"],
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
