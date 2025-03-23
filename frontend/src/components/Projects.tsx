import { useDispatch } from "react-redux";
import {
	useCreateProjectMutation,
	useGetProjectsQuery,
} from "../api/projectApi";
import { useGetMeQuery } from "../api/userApi";
import { closeProjectCreateModal } from "../store/projectCreateModalSlice";
import { AppDispatch } from "../store/store";
import { CreateProjectRequest } from "../types/projectTypes";
import Modal from "./Modal";
import ProjectForm from "./ProjectForm";
import ProjectsList from "./ProjectsList";

const Projects: React.FC = () => {
	const [createProject] = useCreateProjectMutation();
	const { data: projects } = useGetProjectsQuery();
	const { data: currentUser } = useGetMeQuery();
	const dispatch = useDispatch<AppDispatch>();

	const handleCreateProject = async (formData: CreateProjectRequest) => {
		try {
			await createProject(formData).unwrap();

			dispatch(closeProjectCreateModal());
		} catch (error) {
			console.error("Error creating project:", error);
		}
	};

	return (
		<>
			<ProjectsList projects={projects} />

			<Modal>
				<ProjectForm
					onSubmit={handleCreateProject}
					currentUserId={currentUser?._id}
				/>
			</Modal>
		</>
	);
};

export default Projects;
