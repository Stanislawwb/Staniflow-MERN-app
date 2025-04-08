import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select, { MultiValue } from "react-select";
import {
	useCreateProjectMutation,
	useUpdateProjectMutation,
} from "../api/projectApi";
import { useGetUsersQuery } from "../api/userApi";
import { closeModal } from "../store/modalSlice";
import { AppDispatch, RootState } from "../store/store";
import {
	CreateProjectRequest,
	ProjectMember,
	Role,
} from "../types/projectTypes";

interface UserOption {
	value: string;
	label: string;
}

const ProjectForm = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { payload, type } = useSelector((state: RootState) => state.modal);

	const isEdit = type === "project-edit";
	const [createProject] = useCreateProjectMutation();
	const [updateProject] = useUpdateProjectMutation();
	const { data: getUsers } = useGetUsersQuery();

	const defaultValues = payload?.defaultValues || {};
	const projectId = payload?.projectId;

	const currentUser = useSelector((state: RootState) => state.auth.user);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<CreateProjectRequest>({ mode: "onChange", defaultValues });

	const userOptions: UserOption[] =
		getUsers
			?.filter((user) => user._id !== currentUser?._id)
			.map((user) => ({
				value: user._id,
				label: user.username,
			})) || [];

	const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);

	useEffect(() => {
		if (!defaultValues?.title) return;

		reset(defaultValues);
		setSelectedMembers(defaultValues.members || []);
	}, [defaultValues?.title]);

	const handleMemberChange = (selectedOptions: MultiValue<UserOption>) => {
		const membersWithRoles = selectedOptions.map((option) => {
			const selectedUser = getUsers?.find(
				(user) => user._id === option.value
			);

			return {
				user: {
					_id: option.value,
					username: option.label,
					avatar: selectedUser?.avatar || "default-avatar.png",
				},
				role: "developer" as Role,
			};
		});
		setSelectedMembers(membersWithRoles);
	};

	const handleRoleChange = (userId: string, role: Role) => {
		setSelectedMembers((prev) =>
			prev.map((member) =>
				member.user._id === userId ? { ...member, role } : member
			)
		);
	};

	const validateDueDate = (value: unknown) => {
		const selectedDate =
			value instanceof Date ? value : new Date(value as string);

		if (!selectedDate || isNaN(selectedDate.getTime())) {
			return "Due date is required.";
		}

		if (selectedDate <= new Date()) {
			return "Due date must be in the future.";
		}

		return true;
	};

	const CustomInput = forwardRef<
		HTMLInputElement,
		{ value?: string; onClick?: () => void }
	>(({ value, onClick }, ref) => (
		<input
			type="text"
			ref={ref}
			value={value}
			onClick={onClick}
			readOnly
			placeholder="Select a due date"
		/>
	));

	const onSubmit = async (data: CreateProjectRequest) => {
		try {
			if (isEdit) {
				if (!projectId) {
					console.error("Project ID is required");
					return;
				}

				await updateProject({
					projectId,
					data: {
						...data,
						members: selectedMembers.map((member) => ({
							userId: member.user._id,
							role: member.role,
						})),
					},
				}).unwrap();
			} else {
				await createProject({
					...data,
					members: selectedMembers.map((member) => ({
						userId: member.user._id,
						role: member.role,
					})),
				}).unwrap();
			}

			dispatch(closeModal());
			reset();
		} catch (error) {
			console.error("Project submit error", error);
		}
	};

	return (
		<form
			className="form-modal"
			onSubmit={handleSubmit(async (data) => {
				await onSubmit({ ...data, members: selectedMembers });
				setSelectedMembers([]);
				reset();
			})}
			onClick={(e) => e.stopPropagation()}
		>
			<div
				className="form__close"
				onClick={() => dispatch(closeModal())}
			></div>

			<h6>{isEdit ? "Edit Project" : "Create Project"}</h6>

			<div className="form__rows">
				<div className="form__row">
					<label htmlFor="title">Title</label>

					<input
						type="text"
						id="title"
						{...control.register("title", {
							required: "Title is required",
							minLength: {
								value: 3,
								message:
									"Title must be at least 3 characters long.",
							},
						})}
					/>

					{errors.title && (
						<p className="error">{errors.title.message}</p>
					)}
				</div>

				<div className="form__row">
					<label htmlFor="description">Description</label>

					<input
						type="text"
						id="description"
						{...control.register("description")}
					/>
				</div>

				{userOptions && (
					<div className="form__row">
						<label htmlFor="members">Members</label>

						<Select
							options={userOptions}
							isMulti
							onChange={handleMemberChange}
							className="react-select-container"
							classNamePrefix="react-select"
							value={selectedMembers.map((member) => ({
								value: member.user._id,
								label: member.user.username,
							}))}
						/>
					</div>
				)}

				{selectedMembers.map((member, index) => (
					<div
						key={member.user._id || `member-${index}`}
						className="form__row form__select"
					>
						<label>
							Role for{" "}
							{userOptions.find(
								(u) => u.value === member.user._id
							)?.label || member.user.username}
						</label>
						<select
							value={member.role}
							onChange={(e) =>
								handleRoleChange(
									member.user._id,
									e.target.value as Role
								)
							}
						>
							<option value="admin">Admin</option>
							<option value="developer">Developer</option>
							<option value="guest">Guest</option>
						</select>
					</div>
				))}

				{/* <div className="form__row">
					<label htmlFor="tags">Tags</label>

					<select name="tags" id="tags">
						<option value="option-1">Option 1</option>
					</select>
				</div> */}

				<div className="form__row">
					<label htmlFor="dueDate">Due Date</label>

					<Controller
						control={control}
						name="dueDate"
						rules={{ validate: validateDueDate }}
						render={({ field }) => (
							<DatePicker
								selected={
									field.value ? new Date(field.value) : null
								}
								onChange={(date) => field.onChange(date)}
								dateFormat="yyyy-MM-dd"
								minDate={new Date()}
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								timeCaption="Time"
								className="hello"
								customInput={<CustomInput />}
							/>
						)}
					/>

					{errors.dueDate && (
						<p className="error">{errors.dueDate.message}</p>
					)}
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
					{isEdit ? "Save Project" : "Add Changes"}
				</button>
			</div>
		</form>
	);
};

export default ProjectForm;
