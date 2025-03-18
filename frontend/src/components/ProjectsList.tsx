import { Link } from "react-router-dom";
import { DetailedProject } from "../types/projectTypes";

interface ProjectListProps {
	projects: DetailedProject[] | undefined;
}

const ProjectsList: React.FC<ProjectListProps> = ({ projects }) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Progress</th>
					<th>Members</th>
					<th>Start</th>
					<th>End</th>
					<th>Status</th>
					<th>Owner</th>
				</tr>
			</thead>

			<tbody>
				{projects &&
					projects.map((project) => (
						<Link
							to={`/projects/${project._id}`}
							className="project"
							key={project._id}
						>
							<tr>
								<td>{project.title}</td>

								{/* <td>{project.title}</td>  */}

								<td>
									{project.members &&
									project.members.length > 0 ? (
										<div className="members-list">
											{project.members.map((member) => (
												<span key={member.userId._id}>
													{member.userId.username
														.charAt(0)
														.toUpperCase()}
												</span>
											))}
										</div>
									) : (
										"-"
									)}
								</td>

								<td>
									{new Date(project.createdAt).toLocaleString(
										"en-GB",
										{
											day: "2-digit",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										}
									)}
								</td>

								<td>
									{new Date(project.dueDate).toLocaleString(
										"en-GB",
										{
											day: "2-digit",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										}
									)}
								</td>

								<td>{project.status}</td>

								<td>{project.createdBy.username}</td>
							</tr>
						</Link>
					))}
			</tbody>
		</table>
	);
};

export default ProjectsList;
