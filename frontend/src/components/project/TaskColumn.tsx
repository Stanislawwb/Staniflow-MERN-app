import { Droppable } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { openModal } from "../../store/modalSlice";
import { AppDispatch } from "../../store/store";
import { Task, TaskStatus } from "../../types/taskTypes";
import TaskCard from "./TaskCard";
import { useParams } from "react-router-dom";

type TaskColumnProps = {
	status: TaskStatus;
	tasks: Task[];
};

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { projectId } = useParams();

	return (
		<Droppable droppableId={status} key={status}>
			{(provided) => (
				<div
					className="task-board__column"
					ref={provided.innerRef}
					{...provided.droppableProps}
				>
					<span className="task-board__column-title">{status}</span>

					<div className="task-board__column-tasks">
						{tasks
							?.filter((task) => task.status === status)
							.map((task, index) => (
								<TaskCard
									key={task._id}
									task={task}
									index={index}
								/>
							))}

						{provided.placeholder}
					</div>

					<button
						onClick={() =>
							dispatch(
								openModal({
									type: "task-create",
									payload: {
										projectId,
										defaultValues: {
											status,
										},
									},
								})
							)
						}
					>
						Add Task
					</button>
				</div>
			)}
		</Droppable>
	);
};

export default TaskColumn;
