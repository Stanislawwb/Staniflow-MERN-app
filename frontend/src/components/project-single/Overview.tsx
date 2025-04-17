import { toast } from "react-toastify";
import {
	useDeleteProjectMutation,
	useUpdateProjectMutation,
} from "../../api/projectApi";
import { DetailedProject, ProjectActivity } from "../../types/projectTypes";
import {
	formatDate,
	formatProjectActivity,
	statusClassMap,
} from "../../utils/helpers";
import Members from "../Members";
import { useNavigate } from "react-router-dom";

interface OverviewProps {
	project: DetailedProject;
}

const Overview: React.FC<OverviewProps> = ({ project }) => {
	const [updateProject] = useUpdateProjectMutation();
	const [deleteProject, { isLoading: isDeleting }] =
		useDeleteProjectMutation();

	const navigate = useNavigate();

	const handleArchive = async () => {
		await updateProject({
			projectId: project._id,
			data: { isArchived: true },
		});
	};

	const handleUnarchive = async () => {
		await updateProject({
			projectId: project._id,
			data: { isArchived: false },
		});
	};

	const handleDelete = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this project?"
		);

		if (!confirmed) return;

		try {
			await deleteProject(project._id).unwrap();

			toast.success(`Project "${project.title}" deleted`);

			navigate("/dashboard");
		} catch (error) {
			console.error("Failed to delete project", error);
			toast.error("Failed to delete project. Please try again.");
		}
	};
	return (
		<div className="overview">
			<div className="shell">
				<div className="overview__inner">
					<div className="overview__header">
						<span className="overview__label">Description</span>

						<p>{project.description}</p>
					</div>

					<div className="overview__body">
						<div className="overview__rows">
							<div className="overview__row">
								<span className="overview__label">
									Assigned
								</span>

								<div className="overview__members">
									<Members members={project.members} />
								</div>
							</div>

							<div className="overview__row">
								<span className="overview__label">
									Due Date
								</span>

								<div className="overview__date">
									<span>{formatDate(project.dueDate)}</span>
								</div>
							</div>

							<div className="overview__row">
								<span className="overview__label">Status</span>

								<span
									className={`status ${
										statusClassMap[
											project.status as keyof typeof statusClassMap
										] || ""
									}`}
								>
									{project.status}
								</span>
							</div>

							<div className="overview__row">
								<span className="overview__label">Creator</span>

								<div className="overview__creator">
									<img
										src={`/${project.createdBy.avatar}`}
										alt=""
									/>

									<span>{project.createdBy.username}</span>
								</div>
							</div>

							<div className="overview__actions">
								<button
									className="btn"
									onClick={handleDelete}
									disabled={isDeleting}
								>
									{isDeleting
										? "Deleting..."
										: "Delete Project"}
								</button>

								{!project.isArchived ? (
									<button
										className="btn"
										onClick={handleArchive}
									>
										Archive Project
									</button>
								) : (
									<button
										className="btn"
										onClick={handleUnarchive}
									>
										Unarchive Project
									</button>
								)}
							</div>
						</div>

						<div className="overview__activity">
							<h6>Activity Log</h6>

							<ul>
								{project.activityLog.length > 0 &&
									project.activityLog.map((log) => (
										<li key={log._id}>
											{formatProjectActivity(
												log as ProjectActivity
											)}
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Overview;
