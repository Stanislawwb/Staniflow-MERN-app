import {
	faArrowRotateLeft,
	faCalendarAlt,
	faChartPie,
	faCircleCheck,
	faSort,
	faTag,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	currentSort: { sortBy: string; sortOrder: "asc" | "desc" };
	onSortChange: (key: string) => void;
}

const ProjectTableHeader: React.FC<HeaderProps> = ({
	currentSort,
	onSortChange,
}) => {
	const navigate = useNavigate();
	const [isResetting, setIsResetting] = useState(false);

	const renderSortIcon = (key: string) => {
		const isActive = currentSort.sortBy === key;
		const isAsc = currentSort.sortOrder === "asc";

		return (
			<FontAwesomeIcon
				icon={faSort}
				className={`project__sort ${isActive ? "active" : ""} ${
					isActive && isAsc ? "rotated" : ""
				}`}
			/>
		);
	};

	const handleResetSorting = () => {
		setIsResetting(true);

		setTimeout(() => {
			navigate({ search: "" });
			setIsResetting(false);
		}, 300);
	};

	return (
		<div role="rowgroup" className="projects__header">
			<div role="row" className="project__row">
				<span role="columnheader" aria-sort="none">
					<div
						className="project__column-content"
						onClick={() => onSortChange("title")}
					>
						<FontAwesomeIcon icon={faTag} /> Name
						{renderSortIcon("title")}
					</div>
				</span>

				<span role="columnheader" aria-sort="none">
					<div className="project__column-content">
						<FontAwesomeIcon icon={faChartPie} /> Progress
					</div>
				</span>

				<span role="columnheader" aria-sort="none">
					<div className="project__column-content">
						<FontAwesomeIcon icon={faUsers} /> Members
					</div>
				</span>

				<span role="columnheader" aria-sort="none">
					<div
						className="project__column-content"
						onClick={() => onSortChange("createdAt")}
					>
						<FontAwesomeIcon icon={faCalendarAlt} /> Start Date
						{renderSortIcon("createdAt")}
					</div>
				</span>

				<span role="columnheader" aria-sort="none">
					<div
						className="project__column-content"
						onClick={() => onSortChange("dueDate")}
					>
						<FontAwesomeIcon icon={faCalendarAlt} /> Due Date
						{renderSortIcon("dueDate")}
					</div>
				</span>

				<span role="columnheader" aria-sort="none">
					<div
						className="project__column-content"
						onClick={() => onSortChange("status")}
					>
						<FontAwesomeIcon icon={faCircleCheck} /> Status
						{renderSortIcon("status")}
					</div>
				</span>
			</div>

			<button
				className={`project__sorting-reset ${
					isResetting
						? "fading-out"
						: currentSort.sortBy !== "createdAt" ||
						  currentSort.sortOrder !== "desc"
						? "active"
						: ""
				}`}
				onClick={handleResetSorting}
			>
				<FontAwesomeIcon icon={faArrowRotateLeft} />
			</button>
		</div>
	);
};

export default ProjectTableHeader;
