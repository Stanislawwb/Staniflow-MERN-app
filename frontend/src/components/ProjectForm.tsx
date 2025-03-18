import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import Select, { MultiValue } from "react-select";
import { useGetUsersQuery } from "../api/userApi";
import {
	CreateProjectRequest,
	ProjectMember,
	Role,
} from "../types/projectTypes";

interface UserOption {
	value: string;
	label: string;
}

interface ProjectFormProps {
	setDisplayModal: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (formData: CreateProjectRequest) => Promise<void>;
	currentUserId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
	setDisplayModal,
	onSubmit,
	currentUserId,
}) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<CreateProjectRequest>({ mode: "onChange" });

	const { data: getUsers } = useGetUsersQuery();

	const userOptions: UserOption[] =
		getUsers
			?.filter((user) => user._id !== currentUserId)
			.map((user) => ({
				value: user._id,
				label: user.username,
			})) || [];

	const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);

	const handleMemberChange = (selectedOptions: MultiValue<UserOption>) => {
		const membersWithRoles = selectedOptions.map((option) => ({
			userId: {
				_id: option.value,
				username: option.label,
			},
			role: "developer" as Role,
		}));
		setSelectedMembers(membersWithRoles);
	};

	const handleRoleChange = (userId: string, role: Role) => {
		setSelectedMembers((prev) =>
			prev.map((member) =>
				member.userId._id === userId ? { ...member, role } : member
			)
		);
	};

	const validateDueDate = (value: unknown) => {
		const selectedDate =
			value instanceof Date ? value : new Date(value as string);

		if (!selectedDate || isNaN(selectedDate.getTime())) {
			return "Due date is required.";
		}

		const now = new Date();

		if (selectedDate <= now) {
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

	return (
		<form
			className="form-project"
			onSubmit={handleSubmit(async (data) => {
				await onSubmit({ ...data, members: selectedMembers });
				setSelectedMembers([]);
				reset();
			})}
			onClick={(e) => e.stopPropagation()}
		>
			<div
				className="form__close"
				onClick={() => setDisplayModal(false)}
			></div>

			<h6>Create Project</h6>

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
								value: member.userId._id,
								label: member.userId.username,
							}))}
						/>
					</div>
				)}

				{selectedMembers.map((member) => (
					<div
						key={member.userId._id}
						className="form__row form__select"
					>
						<label>
							Role for{" "}
							{
								userOptions.find(
									(u) => u.value === member.userId.username
								)?.label
							}
						</label>
						<select
							value={member.role}
							onChange={(e) =>
								handleRoleChange(
									member.userId._id,
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
					Add Project
				</button>
			</div>
		</form>
	);
};

export default ProjectForm;
