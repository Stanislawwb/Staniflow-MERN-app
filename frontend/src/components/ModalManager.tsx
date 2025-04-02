import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import ProjectForm from "./ProjectForm";

const ModalManager = () => {
	const { type } = useSelector((state: RootState) => state.modal);

	if (!type) return null;

	let content = null;
	switch (type) {
		case "task-create":
		case "task-edit":
			content = <TaskForm />;
			break;
		case "project-create":
		case "project-edit":
			content = <ProjectForm />;
			break;
	}

	return <Modal>{content}</Modal>;
};

export default ModalManager;
