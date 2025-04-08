import { Draggable } from "@hello-pangea/dnd";
import React from "react";
import { Task } from "../../types/taskTypes";

type TaskCardProps = {
	task: Task;
	index: number;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
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
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
