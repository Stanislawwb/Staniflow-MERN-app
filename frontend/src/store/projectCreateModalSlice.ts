import { createSlice } from "@reduxjs/toolkit";

interface ProjectCreateModalState {
	displayModal: boolean;
}

const initialState: ProjectCreateModalState = {
	displayModal: false,
};

const projectCreateModalSlice = createSlice({
	name: "projectCreateModal",
	initialState,
	reducers: {
		openProjectCreateModal: (state) => {
			state.displayModal = true;
		},
		closeProjectCreateModal: (state) => {
			state.displayModal = false;
		},
	},
});

export const { openProjectCreateModal, closeProjectCreateModal } =
	projectCreateModalSlice.actions;
export default projectCreateModalSlice.reducer;
