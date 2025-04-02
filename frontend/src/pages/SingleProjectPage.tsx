import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { useGetProjectQuery } from "../api/projectApi";
import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm";
import { openProjectCreateModal } from "../store/projectCreateModalSlice";
import { AppDispatch } from "../store/store";
import TaskBoard from "../components/TaskBoard";

const SingleProjectPage = () => {
	const { projectId } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: project } = useGetProjectQuery(projectId);

	const defaultValues = {
		title: project?.title,
		description: project?.description,
		members: project?.members,
		dueDate: project?.dueDate,
	};

	const handleEditProject = async () => {};

	return (
		<div className="project-page">
			<div className="project__inner">
				<div className="shell">
					<div className="project__header">
						<div className="project__header-content">
							<h1 className="h5">{project?.title}</h1>

							<p>{project?.description}</p>
						</div>

						<div className="project__header-actions">
							<button
								className="btn btn--green"
								onClick={() =>
									dispatch(openProjectCreateModal())
								}
							>
								Edit Project
							</button>
						</div>
					</div>
				</div>

				<TaskBoard />

				<Modal>
					<ProjectForm
						onSubmit={handleEditProject}
						currentUserId={""}
						defaultValues={defaultValues}
						mode="edit"
					/>
				</Modal>
			</div>
		</div>
	);
};

export default SingleProjectPage;
