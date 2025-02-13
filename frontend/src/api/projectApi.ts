import {
	CreateProjectRequest,
	CreateProjectResponse,
	DetailedProject,
	Project,
	ProjectMember,
} from "../types/projectTypes";
import api from "./api";

export const projectApi = api.injectEndpoints({
	endpoints: (builder) => ({
		createProject: builder.mutation<
			CreateProjectResponse,
			CreateProjectRequest
		>({
			query: (newProject) => ({
				url: "/projects/",
				method: "POST",
				body: newProject,
			}),
			invalidatesTags: [{ type: "Projects", id: "LIST" }],
		}),
		getProjects: builder.query<Project[], void>({
			query: () => ({
				url: "/projects/",
			}),
			providesTags: (result) =>
				result
					? [
							{ type: "Projects", id: "LIST" },
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
			{ id: string; data: Partial<CreateProjectRequest> }
		>({
			query: ({ id, data }) => ({
				url: `/projects/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Projects", id }],
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
			{ id: string; member: Omit<ProjectMember, "_id"> }
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
			{ id: string; userId: string }
		>({
			query: ({ id, userId }) => ({
				url: `/projects/${id}/members`,
				method: "DELETE",
				body: { userId },
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
