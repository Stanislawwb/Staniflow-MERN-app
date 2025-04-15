import { Draggable } from "@hello-pangea/dnd";
import React from "react";
import { Task } from "../../types/taskTypes";

type TaskCardProps = {
	task: Task;
	index: number;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
	const getPriorityLevel = (priority: string) => {
		switch (priority.toLowerCase()) {
			case "low":
				return 1;
			case "medium":
				return 2;
			case "high":
				return 3;
			default:
				return 0;
		}
	};

	console.log(task);

	const priorityLevel = getPriorityLevel(task?.priority || "");

	return (
		<Draggable draggableId={task._id} index={index}>
			{(provided) => (
				<div
					role="button"
					tabIndex={0}
					className="task-card"
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<p>{task.title}</p>

					<div
						className={`task__indicator task__priority-${priorityLevel}`}
					>
						{Array.from({ length: priorityLevel }).map((_, i) => (
							<span key={i}></span>
						))}
					</div>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
