import { useUpdateProjectMutation } from "../../api/projectApi";
import { DetailedProject, ProjectActivity } from "../../types/projectTypes";
import {
	formatDate,
	formatProjectActivity,
	statusClassMap,
} from "../../utils/helpers";
import Members from "../Members";

interface OverviewProps {
	project: DetailedProject;
}

const Overview: React.FC<OverviewProps> = ({ project }) => {
	const [updateProject] = useUpdateProjectMutation();

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
								<button className="btn">Delete Project</button>

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
