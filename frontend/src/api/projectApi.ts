import {
	CreateProjectResponse,
	CreateProjectSubmitData,
	DetailedProject,
	ProjectMember,
} from "../types/projectTypes";
import api from "./api";

export const projectApi = api.injectEndpoints({
	endpoints: (builder) => ({
		createProject: builder.mutation<
			CreateProjectResponse,
			CreateProjectSubmitData
		>({
			query: (newProject) => ({
				url: "/projects",
				method: "POST",
				body: newProject,
			}),
			invalidatesTags: [{ type: "Projects", id: "LIST" }],
		}),
		getProjects: builder.query<DetailedProject[], void>({
			query: () => ({
				url: "/projects",
			}),
			providesTags: (result) =>
				result
					? [
							{ type: "Projects", id: "LIST" },
							{ type: "UserMe" },
							...result.map(({ _id }) => ({
								type: "Projects" as const,
								id: _id,
							})),
					  ]
					: ["Projects"],
		}),
		getProject: builder.query<DetailedProject, string>({
			query: (id) => ({
				url: `/projects/${id}`,
			}),
			providesTags: (_, __, id) => [{ type: "Projects", id }],
		}),
		updateProject: builder.mutation<
			DetailedProject,
			{ projectId: string; data: Partial<CreateProjectSubmitData> }
		>({
			query: ({ projectId, data }) => ({
				url: `/projects/${projectId}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_, __, { projectId }) => [
				{ type: "Projects", id: projectId },
				{ type: "Projects", id: "LIST" },
			],
		}),
		deleteProject: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: `/projects/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, id) => [
				{ type: "Projects", id },
				{ type: "Projects", id: "LIST" },
			],
		}),
		addMemberToProject: builder.mutation<
			DetailedProject,
			{ id: string; member: Omit<ProjectMember, "user._id"> }
		>({
			query: ({ id, member }) => ({
				url: `/projects/${id}/members`,
				method: "PATCH",
				body: member,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Projects", id }],
		}),
		removeMemberFromProject: builder.mutation<
			DetailedProject,
			{ id: string; user: string }
		>({
			query: ({ id, user }) => ({
				url: `/projects/${id}/members`,
				method: "DELETE",
				body: { user },
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Projects", id }],
		}),
	}),
});

export const {
	useCreateProjectMutation,
	useGetProjectsQuery,
	useGetProjectQuery,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
	useAddMemberToProjectMutation,
	useRemoveMemberFromProjectMutation,
} = projectApi;
