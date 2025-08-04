import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import type {
  Movie,
  MovieQueryParams,
  MoviesResponse,
  MoviesState,
} from "@/types/type";

export const useMoviesStore = create<MoviesState>((set) => ({
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
}));

export const useFetchMovies = (params: MovieQueryParams = {}) => {
  const { authUser } = useAuthStore.getState();

  return useQuery<MoviesResponse>({
    queryKey: ["movies", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.type && params.type !== "all")
        searchParams.append("type", params.type);
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const res = await axiosInstance.get(`/show?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      return res.data;
    },
    enabled: !!authUser?.token,
  });
};

export const useFetchMoviesInfinite = (
  params: Omit<MovieQueryParams, "page"> = {}
) => {
  const { authUser } = useAuthStore.getState();

  return useInfiniteQuery<MoviesResponse>({
    queryKey: ["movies-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      // queryFn: async ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams();

      searchParams.append("page", String(pageParam));
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.type && params.type !== "all")
        searchParams.append("type", params.type);
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const res = await axiosInstance.get(`/show?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: !!authUser?.token,
  });
};

export const useCreateMovie = () => {
  const { authUser } = useAuthStore.getState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMovie: Partial<Movie>) => {
      const res = await axiosInstance.post("/show", newMovie, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("The movie has been added successfully.");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies-infinite"] });
    },
    onError: () => {
      toast.error("Failed to add movie");
    },
  });
};

export const useUpdateMovie = () => {
  const { authUser } = useAuthStore.getState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      const res = await axiosInstance.put(`/show/${movie.id}`, movie, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("The movie has been modified.");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies-infinite"] });
    },
    onError: () => {
      toast.error("Failed to edit the movie");
    },
  });
};

export const useDeleteMovie = () => {
  const { authUser } = useAuthStore.getState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/show/${id}`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("The movie has been deleted.");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies-infinite"] });
    },
    onError: () => {
      toast.error("Failed to delete the movie");
    },
  });
};
