const Modal = ({ isOpen, onClose, children }) => {
	return (
		<div className="modal-overlay">
			<div className="modal__content">{children}</div>
		</div>
	);
};

export default Modal;
