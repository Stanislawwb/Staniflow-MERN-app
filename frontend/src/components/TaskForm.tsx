import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../api/taskApi";
import { closeModal } from "../store/modalSlice";
import { AppDispatch, RootState } from "../store/store";
import { CreateTaskRequest } from "../types/taskTypes";
import { useEffect } from "react";

const TaskForm = () => {
	const dispatch = useDispatch<AppDispatch>();

	const { payload, type } = useSelector((state: RootState) => state.modal);
	const isEdit = type === "task-edit";

	const [createTask] = useCreateTaskMutation();
	const [updateTask] = useUpdateTaskMutation();

	const projectId = payload?.projectId;
	const defaultValues = payload?.defaultValues || {};
	const taskId = payload?.taskId;

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		setError,
	} = useForm<CreateTaskRequest>({ mode: "onChange", defaultValues });

	useEffect(() => {
		if (isEdit && defaultValues?.title) {
			reset(defaultValues);
		}
	}, [isEdit, defaultValues, reset]);

	const onSubmit = async (data: CreateTaskRequest) => {
		if (!projectId) return;

		try {
			if (isEdit && taskId) {
				await updateTask({ taskId, data }).unwrap();
			} else {
				await createTask({ projectId, data }).unwrap();
			}

			dispatch(closeModal());
			reset();
		} catch (error: any) {
			if (error?.status === 409) {
				setError("title", {
					type: "manual",
					message: "A task with this title already exists",
				});
			} else {
				console.error("Failed to submit task:", error);
			}
		}
	};

	return (
		<form
			className="form-modal"
			onClick={(e) => e.stopPropagation()}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div
				className="form__close"
				onClick={() => dispatch(closeModal())}
			></div>

			<h6>{isEdit ? "Edit Task" : "Create Task"}</h6>

			<div className="form__rows">
				<div className="form__row">
					<label htmlFor="title">Title</label>

					<input
						type="text"
						id="title"
						{...register("title", {
							required: "Title is required",
						})}
					/>

					{errors.title && (
						<p className="error">{errors.title.message}</p>
					)}
				</div>

				<div className="form__row">
					<label htmlFor="description">Description</label>

					<textarea
						id="description"
						rows={4}
						{...register("description")}
					/>
				</div>

				<div className="form__row form__select">
					<label htmlFor="priority">Priority</label>

					<select id="priority" {...register("priority")}>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
				</div>
			</div>

			<div className="form__actions">
				<button
					type="submit"
					className={`btn--green ${
						isValid === false ? "disabled" : ""
					}`}
					disabled={!isValid}
				>
					{isEdit ? "Save Task" : "Add Task"}
				</button>
			</div>
		</form>
	);
};

export default TaskForm;
