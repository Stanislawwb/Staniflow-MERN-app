import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api/api";

interface AuthState {
	token: string | null;
	isLoading: boolean;
}

const initialState: AuthState = {
	token: null,
	isLoading: true,
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

export const { login, logout, setAccessToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
