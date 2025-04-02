import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType =
	| "task-create"
	| "task-edit"
	| "project-create"
	| "project-edit"
	| null;

interface ModalState {
	type: ModalType;
	payload?: Record<string, any>;
}

const initialState: ModalState = {
	type: null,
	payload: undefined,
};

const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<ModalState>) => {
			state.type = action.payload.type;
			state.payload = action.payload.payload;
		},
		closeModal: (state) => {
			state.type = null;
			state.payload = undefined;
		},
	},
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
