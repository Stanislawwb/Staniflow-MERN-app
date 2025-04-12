import { DetailedProject } from "../types/projectTypes";

interface ProgressBarProps {
	project: DetailedProject;
	className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ project, className }) => {
	if (!project) return;

	return (
		<div className={`progress-bar ${className}`}>
			<div
				className="progress-bar__fill"
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
	);
};

export default ProgressBar;
