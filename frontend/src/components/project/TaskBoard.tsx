import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useUpdateProjectMutation } from "../../api/projectApi";
import { useGetTasksQuery, useUpdateTaskMutation } from "../../api/taskApi";
import { Task, TaskStatus } from "../../types/taskTypes";
import TaskColumn from "./TaskColumn";

const TaskBoard = () => {
	const { projectId } = useParams();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: tasks } = useGetTasksQuery({ projectId });
	const [updateProject] = useUpdateProjectMutation();
	const [updateTask] = useUpdateTaskMutation();

	const taskStatuses: TaskStatus[] = ["To Do", "In Progress", "Done"];
	const [localTasks, setLocalTasks] = useState<Task[]>([]);

	useEffect(() => {
		if (tasks) {
			setLocalTasks(tasks);
		}
	}, [tasks]);

	const onDragEnd = async (result: DropResult) => {
		const { source, destination, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId)
			return;

		const updatedTasks = localTasks.map((task) =>
			task._id === draggableId
				? { ...task, status: destination.droppableId as TaskStatus }
				: task
		);

		setLocalTasks(updatedTasks);

		try {
			await updateTask({
				taskId: draggableId,
				data: {
					status: destination.droppableId as TaskStatus,
				},
			});
		} catch (error) {
			console.error("Error updating task status", error);
		}

		const allDone = updatedTasks.every((task) => task.status === "Done");
		const anyNotDone = updatedTasks.some((task) => task.status !== "Done");

		try {
			if (allDone) {
				await updateProject({
					projectId,
					data: { status: "Completed" },
				});
			} else if (anyNotDone) {
				await updateProject({
					projectId,
					data: { status: "In Progress" },
				});
			}
		} catch (err) {
			console.error("Failed to update project status:", err);
		}
	};

	return (
		<div className="task-board">
			<div className="shell">
				<div className="task-board__inner">
					<DragDropContext onDragEnd={onDragEnd}>
						<div className="task-board__columns">
							{taskStatuses.map((status) => (
								<TaskColumn
									key={status}
									status={status}
									tasks={localTasks.filter(
										(task) => task.status === status
									)}
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
