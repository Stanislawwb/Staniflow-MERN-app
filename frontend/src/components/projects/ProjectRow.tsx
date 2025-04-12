import { Link } from "react-router-dom";
import { DetailedProject } from "../../types/projectTypes";
import ProgressBar from "../ProgressBar";
import ProjectMembers from "./ProjectMembers";
import { formatDate } from "../../utils/helpers";

interface ProjectRowProps {
	project: DetailedProject;
	index: number;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index }) => {
	const statusClassMap: { [key: string]: string } = {
		Completed: "project__status--green",
		"In Progress": "project__status--purple",
		Archived: "project__status--red",
	};

	return (
		<div
			role="row"
			aria-rowindex={index + 1}
			key={project._id}
			className="project__row"
		>
			<Link to={`/projects/${project._id}`}></Link>

			<span role="cell">{project.title}</span>

			<span role="cell" className="project__progress">
				<small>
					{project.completedTasksCount} / {project.tasksCount}
				</small>

				<ProgressBar project={project} />
			</span>

			<span role="cell">
				<ProjectMembers members={project.members} />
			</span>

			<span role="cell">{formatDate(project.createdAt)}</span>

			<span role="cell">{formatDate(project.dueDate)}</span>

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
	);
};

export default ProjectRow;
