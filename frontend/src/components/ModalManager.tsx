// import { useSelector } from "react-redux";
// import Modal from "./Modal"
// import { RootState } from "../store/store";
// import TaskForm from "./TaskForm";
// import ProjectForm from "./ProjectForm";

// const ModalManager = () => {
//     const {type, payload} = useSelector((state: RootState) => state.modal)

//     if(!type) return null;

//     let modalContent: React.ReactNode = null;

// switch (type) {
//     case "task-create":
//         modalContent = <TaskForm status={payload?.status}/>
//         break;
//     case "task-edit":
//         modalContent = <TaskForm taskId={payload?.taskId}/>
//         break;
//     case "project-create":
//         modalContent = <ProjectForm mode={payload?.status}/>
//         break;
//     case "project-create":
//         modalContent = <TaskForm status={payload?.status}/>
//         break;
// }

//   return <Modal>{modalContent}<Modal/>;

// }

// export default ModalManager;
