import { DragDropContext } from "@hello-pangea/dnd";
import { Navigate, useParams } from "react-router-dom";
import { useGetTasksQuery } from "../../api/taskApi";
import useTaskBoardDrag from "../../hooks/useTaskBoardDrag";
import { TaskStatus } from "../../types/taskTypes";
import TaskColumn from "./TaskColumn";
import { DetailedProject } from "../../types/projectTypes";

interface TaskBoardProps {
	project?: DetailedProject;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ project }) => {
	const { projectId } = useParams();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: tasks = [] } = useGetTasksQuery({ projectId });

	const isArchived = project?.isArchived ?? false;

	const { onDragEnd } = useTaskBoardDrag({
		projectId,
		tasks,
		projectStatus: project?.status,
		isArchived,
	});

	const taskStatuses: TaskStatus[] = ["To Do", "In Progress", "Done"];

	return (
		<div className="task-board">
			<div className="shell">
				{isArchived && (
					<div className="task-board__archived-banner">
						This project is archived and read-only.
					</div>
				)}

				<div className="task-board__inner">
					<DragDropContext onDragEnd={onDragEnd}>
						<div className="task-board__columns">
							{taskStatuses.map((status) => (
								<TaskColumn
									key={status}
									status={status}
									tasks={tasks.filter(
										(task) => task.status === status
									)}
									readOnly={!!isArchived}
								/>
							))}
						</div>
					</DragDropContext>
				</div>
			</div>
		</div>
	);
};

export default TaskBoard;
