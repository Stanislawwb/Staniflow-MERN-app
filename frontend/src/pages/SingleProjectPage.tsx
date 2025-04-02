import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { useGetProjectQuery } from "../api/projectApi";
import TaskBoard from "../components/TaskBoard";
import { openModal } from "../store/modalSlice";
import { AppDispatch } from "../store/store";

const SingleProjectPage = () => {
	const { projectId } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: project } = useGetProjectQuery(projectId);

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
									dispatch(
										openModal({
											type: "project-edit",
											payload: {
												projectId,
												defaultValues: {
													title: project?.title,
													description:
														project?.description,
													members: project?.members,
													dueDate: project?.dueDate,
												},
											},
										})
									)
								}
							>
								Edit Project
							</button>
						</div>
					</div>
				</div>

				<TaskBoard />
			</div>
		</div>
	);
};

export default SingleProjectPage;
