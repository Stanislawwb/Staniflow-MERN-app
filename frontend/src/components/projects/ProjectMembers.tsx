import { DetailedProject } from "../../types/projectTypes";

interface ProjectMembersProps {
	members: DetailedProject["members"];
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ members }) => {
	if (!members || members.length === 0) return <span>No members</span>;

	return (
		<div className="projects__members-list">
			{members.slice(0, 3).map((member) => (
				<span key={member.user._id}>
					{member.user.avatar &&
					!member.user.avatar.includes("default-avatar.png") ? (
						<img
							src={member.user.avatar}
							alt={member.user.username}
							className="project__member-avatar"
						/>
					) : (
						member.user.username.charAt(0).toUpperCase()
					)}
				</span>
			))}

			{members.length > 3 && (
				<span className="projects__member-list--extra">
					+{members.length - 3}
				</span>
			)}
		</div>
	);
};

export default ProjectMembers;
