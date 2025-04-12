import {
	faCalendarAlt,
	faChartPie,
	faCircleCheck,
	faTag,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProjectTableHeader = () => {
	return (
		<div role="rowgroup" className="projects__header">
			<div role="row" className="project__row">
				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faTag} /> Name
				</span>

				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faChartPie} /> Progress
				</span>

				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faUsers} /> Members
				</span>

				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faCalendarAlt} /> Start Date
				</span>

				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faCalendarAlt} /> Due Date
				</span>

				<span role="columnheader" aria-sort="none">
					<FontAwesomeIcon icon={faCircleCheck} /> Status
				</span>
			</div>
		</div>
	);
};

export default ProjectTableHeader;
