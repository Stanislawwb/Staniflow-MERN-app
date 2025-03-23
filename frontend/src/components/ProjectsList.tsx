import {
	faCalendarAlt,
	faChartPie,
	faCircleCheck,
	faTag,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DetailedProject } from "../types/projectTypes";

interface ProjectListProps {
	projects: DetailedProject[] | undefined;
}

const ProjectsList: React.FC<ProjectListProps> = ({ projects }) => {
	const statusClassMap: { [key: string]: string } = {
		Completed: "project__status--green",
		"In Progress": "project__status--purple",
		Archived: "project__status--red",
	};
	console.log(projects);

	return (
		<div
			role="table"
			aria-label="Project List"
			aria-rowcount={projects?.length || 0}
			className="projects"
		>
			<div role="rowgroup" className="projects__header">
				<div role="row" className="project__row">
					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faTag} /> Name
					</span>

					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faChartPie} /> Progress
					</span>

					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faUsers} /> Members
					</span>

					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faCalendarAlt} /> Start Date
					</span>

					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faCalendarAlt} /> Due Date
					</span>

					<span role="columnheader" aria-sort="none">
						<FontAwesomeIcon icon={faCircleCheck} /> Status
					</span>
				</div>
			</div>

			<div role="rowgroup" className="projects__body">
				{projects && projects.length > 0 ? (
					projects.map((project, index) => (
						<div
							role="row"
							aria-rowindex={index + 1}
							key={project._id}
							className="project__row"
						>
							<Link to={`/projects/${project._id}`}></Link>

							<span role="cell">{project.title}</span>

							<span role="cell" className="project__progress">
								<div className="project__progress-bar">
									<div
										className="project__progress-bar__fill"
										style={{
											width: `${
												project.tasksCount > 0
													? (project.completedTasksCount /
															project.tasksCount) *
													  100
													: 0
											}%`,
										}}
									></div>
								</div>

								<small>
									{project.completedTasksCount} /{" "}
									{project.tasksCount}
								</small>
							</span>

							<span role="cell">
								{project.members &&
								project.members.length > 0 ? (
									<div className="projects__members-list">
										{project.members
											.slice(0, 3)
											.map((member) => (
												<span key={member.user._id}>
													{member.user.avatar &&
													!member.user.avatar.includes(
														"default-avatar.png"
													) ? (
														<img
															src={
																member.user
																	.avatar
															}
															alt={
																member.user
																	.username
															}
															className="project__member-avatar"
														/>
													) : (
														member.user.username
															.charAt(0)
															.toUpperCase()
													)}
												</span>
											))}

										{project.members.length > 3 && (
											<span className="projects__member-list--extra">
												+{project.members.length - 3}
											</span>
										)}
									</div>
								) : (
									<span>No members</span>
								)}
							</span>

							<span role="cell">
								{new Date(project.createdAt).toLocaleString(
									"en-GB",
									{
										day: "2-digit",
										month: "short",
										hour: "2-digit",
										minute: "2-digit",
										hour12: false,
									}
								)}
							</span>

							<span role="cell">
								{new Date(project.dueDate).toLocaleString(
									"en-GB",
									{
										day: "2-digit",
										month: "short",
										hour: "2-digit",
										minute: "2-digit",
										hour12: false,
									}
								)}
							</span>

							<span
								role="cell"
								className={`project__status ${
									statusClassMap[
										project.status as keyof typeof statusClassMap
									] || ""
								}`}
							>
								{project.status}
							</span>
						</div>
					))
				) : (
					<div role="row">
						<span role="cell">No projects available</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectsList;
