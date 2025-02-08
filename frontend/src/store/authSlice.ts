import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	token: string | null;
}

const initialState: AuthState = {
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		logout: (state) => {
			state.token = null;
		},
		setAccessToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
	},
});

export const { login, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
