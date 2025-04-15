import { DropResult } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateProjectMutation } from "../api/projectApi";
import { taskApi, useReorderTasksMutation } from "../api/taskApi";
import { AppDispatch } from "../store/store";
import { Task, TaskStatus } from "../types/taskTypes";

interface UseTaskBoardDragProps {
	projectId: string;
	tasks: Task[];
	projectStatus?: string;
	isArchived: boolean;
}

const useTaskBoardDrag = ({
	projectId,
	tasks,
	projectStatus,
	isArchived,
}: UseTaskBoardDragProps) => {
	const [reorderTasks] = useReorderTasksMutation();
	const [updateProject] = useUpdateProjectMutation();

	const dispatch = useDispatch<AppDispatch>();

	// Called when drag operation ends (task dropped)
	const onDragEnd = async (result: DropResult) => {
		if (isArchived) {
			return;
		}

		const { source, destination, draggableId } = result;

		// If dropped outside a column or not moved at all
		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		// Find the dragged task
		const taskBeingMoved = tasks.find(
			(task: Task) => task._id === draggableId
		);
		if (!taskBeingMoved) return;

		// Tasks before and after the move
		const sourceStatus = source.droppableId as TaskStatus;
		const destinationStatus = destination.droppableId as TaskStatus;

		const sourceTasks = tasks
			.filter(
				(task: Task) =>
					task.status === sourceStatus && task._id !== draggableId
			)
			.sort((a: Task, b: Task) => a.order - b.order);

		// Insert moved task into destination list
		const destinationTasks = tasks
			.filter(
				(t: Task) =>
					t.status === destinationStatus && t._id !== draggableId
			)
			.sort((a: Task, b: Task) => a.order - b.order);

		destinationTasks.splice(destination.index, 0, {
			...taskBeingMoved,
			status: destinationStatus,
		});

		// Generate payload for server and optimistic UI update
		const updates = [
			...sourceTasks.map((task: Task, index: number) => ({
				taskId: task._id,
				status: sourceStatus,
				order: index,
				projectId,
			})),
			...destinationTasks.map((task: Task, index: number) => ({
				taskId: task._id,
				status: destinationStatus,
				order: index,
				projectId,
			})),
		];

		// Optimistically update cache to reflect UI changes instantly
		dispatch(
			taskApi.util.updateQueryData("getTasks", { projectId }, (draft) => {
				updates.forEach(({ taskId, status, order }) => {
					const task = draft.find((t) => t._id === taskId);
					if (task) {
						task.status = status;
						task.order = order;
					}
				});
			})
		);

		try {
			dispatch(
				taskApi.util.updateQueryData(
					"getTasks",
					{ projectId },
					(draft) => {
						updates.forEach(({ taskId, status, order }) => {
							const task = draft.find((t) => t._id === taskId);
							if (task) {
								task.status = status;
								task.order = order;
							}
						});

						const allTasksAreDone = draft.every(
							(task) => task.status === "Done"
						);

						if (allTasksAreDone && projectStatus !== "Completed") {
							updateProject({
								projectId,
								data: { status: "Completed" },
							});
						} else if (
							!allTasksAreDone &&
							projectStatus !== "In Progress"
						) {
							updateProject({
								projectId,
								data: { status: "In Progress" },
							});
						}
					}
				)
			);

			await reorderTasks({ updates }).unwrap();
		} catch (error) {
			toast.error("Failed to reorder tasks.");
		}
	};

	return { onDragEnd };
};

export default useTaskBoardDrag;
