import { useDispatch, useSelector } from "react-redux";
import { closeProjectCreateModal } from "../store/projectCreateModalSlice";
import { AppDispatch, RootState } from "../store/store";

interface ModalProps {
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
	const dispatch = useDispatch<AppDispatch>();
	const displayModal = useSelector(
		(state: RootState) => state.projectCreateModal.displayModal
	);

	return (
		<div
			className={`modal-project ${displayModal ? "active" : ""}`}
			onClick={() => dispatch(closeProjectCreateModal())}
		>
			<div className="modal__content">{children}</div>
		</div>
	);
};

export default Modal;
