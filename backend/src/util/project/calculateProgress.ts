import Task from "../../models/taskModel";

export const calculateProjectProgress = async (
	projectId: string
): Promise<{
	tasksCount: number;
	completedTasksCount: number;
}> => {
	const tasks = await Task.find({ projectId });

	const tasksCount = tasks.length;
	const completedTasksCount = tasks.filter(
		(task) => task.status === "Done"
	).length;

	return {
		tasksCount,
		completedTasksCount,
	};
};
