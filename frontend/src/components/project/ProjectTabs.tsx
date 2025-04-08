type TabItem = {
	label: string;
};

type ProjectTabsProps = {
	items: TabItem[];
	activeIndex: number;
	onTabClick: (index: number) => void;
};

const ProjectTabs: React.FC<ProjectTabsProps> = ({
	items,
	activeIndex,
	onTabClick,
}) => {
	return (
		<div className="project__tabs">
			<div className="shell">
				<div className="project__tabs-inner">
					{items.map((item, index) => (
						<button
							key={index}
							className={`project__tab ${
								activeIndex === index ? "active" : ""
							}`}
							onClick={() => onTabClick(index)}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProjectTabs;
