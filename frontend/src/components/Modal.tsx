import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../store/modalSlice";
import { AppDispatch, RootState } from "../store/store";

interface ModalProps {
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
	const dispatch = useDispatch<AppDispatch>();
	const displayModal = useSelector((state: RootState) => state.modal.type);

	return (
		<div
			className={`modal-project ${displayModal ? "active" : ""}`}
			onClick={() => dispatch(closeModal())}
		>
			<div className="modal__content">{children}</div>
		</div>
	);
};

export default Modal;
