import { Link } from "react-router-dom";
import { DetailedProject } from "../../types/projectTypes";
import ProgressBar from "../ProgressBar";
import Members from "../Members";
import { formatDate, statusClassMap } from "../../utils/helpers";

interface ProjectRowProps {
	project: DetailedProject;
	index: number;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index }) => {
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
				<Members members={project.members} />
			</span>

			<span role="cell">{formatDate(project.createdAt)}</span>

			<span role="cell">{formatDate(project.dueDate)}</span>

			<span
				role="cell"
				className={`status ${
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
