import { Navigate, useParams } from "react-router-dom";
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "../api/taskApi";
import { Task, TaskStatus } from "../types/taskTypes";

import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

const TaskBoard = () => {
	const { projectId } = useParams();

	if (!projectId) return <Navigate to="/not-found" replace />;

	const { data: tasks } = useGetTasksQuery({ projectId });

	const taskStatuses: TaskStatus[] = ["To Do", "In Progress", "Done"];
	const [localTasks, setLocalTasks] = useState<Task[]>([]);

	useEffect(() => {
		if (tasks) {
			setLocalTasks(tasks);
		}
	}, [tasks]);

	const [updateStatus] = useUpdateTaskStatusMutation();

	const onDragEnd = async (result: DropResult) => {
		const { source, destination, draggableId } = result;

		if (!destination || destination.droppableId === source.droppableId)
			return;

		setLocalTasks((prev) =>
			prev?.map((task) =>
				task._id === draggableId
					? { ...task, status: destination.droppableId as TaskStatus }
					: task
			)
		);

		try {
			await updateStatus({
				taskId: draggableId,
				status: destination.droppableId as TaskStatus,
			});
		} catch (error) {
			console.error("Error updating task status", error);
		}
	};

	const handleCreateTask = async () => {};

	return (
		<div className="task-board">
			<div className="shell">
				<div className="task-board__inner">
					<div className="task-board__header">
						<h5>Project Tasks</h5>
					</div>

					<DragDropContext onDragEnd={onDragEnd}>
						<div className="task-board__columns">
							{taskStatuses.map((status) => (
								<Droppable droppableId={status} key={status}>
									{(provided) => (
										<div
											className="task-board__column"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											<span className="task-board__column-title">
												{status}
											</span>

											<div className="task-board__column-tasks">
												{localTasks
													?.filter(
														(task) =>
															task.status ===
															status
													)
													.map((task, index) => (
														<Draggable
															draggableId={
																task._id
															}
															index={index}
															key={task._id}
														>
															{(provided) => (
																<div
																	role="button"
																	tabIndex={0}
																	className="task-card"
																	ref={
																		provided.innerRef
																	}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<p>
																		{
																			task.title
																		}
																	</p>
																</div>
															)}
														</Draggable>
													))}

												{provided.placeholder}
											</div>

											<button
												onClick={() =>
													handleCreateTask()
												}
											>
												Add Task
											</button>
										</div>
									)}
								</Droppable>
							))}
						</div>
					</DragDropContext>
				</div>
			</div>
		</div>
	);
};

export default TaskBoard;
