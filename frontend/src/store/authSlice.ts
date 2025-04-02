import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";

interface CurrentUser {
	_id: string;
	username: string;
	avatar?: string;
	role?: string;
}

interface AuthState {
	token: string | null;
	isLoading: boolean;
	user: CurrentUser | null;
}

const initialState: AuthState = {
	token: null,
	isLoading: true,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
			state.isLoading = false;
		},
		logout: (state) => {
			state.token = null;
			state.isLoading = false;
		},
		setAccessToken: (state, action: PayloadAction<string | null>) => {
			state.token = action.payload;
			state.isLoading = false;
		},
		setUser: (state, action: PayloadAction<CurrentUser | null>) => {
			state.user = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(api.util.resetApiState, (state) => {
			state.token = null;
		});
	},
});

export const { login, logout, setAccessToken, setUser, setLoading } =
	authSlice.actions;
export default authSlice.reducer;
