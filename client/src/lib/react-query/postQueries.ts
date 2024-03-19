import { INewPost, IUpdatePost } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import {
  createPost,
  getInfinitePosts,
  getRecentPosts,
  searchPosts,
  updatePost,
  deletePost,
  getPostById,
  getUserPosts,
  deleteFavoritePost,
  getFavoritedPosts,
  favoritePost,
  likePost,
} from "../api/postAPI";

// POST QUERIES
//

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }) => {
      try {
        const posts = await getInfinitePosts({ pageParam });
        return posts;
      } catch (error) {
        console.error("Error fetching infinite posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.length === 0) {
        return null;
      }

      const lastId = lastPage[lastPage.length - 1].id;
      return lastId;
    },
    initialPageParam: 1,
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: INewPost) => createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatePostData: IUpdatePost) => updatePost(updatePostData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.UPDATE_POST, data],
      });
    },
  });
};

export const useFavoritePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      postId: string;
      favoritesArray: string[];
    }) => {
      const { userId, postId, favoritesArray } = params;
      try {
        const favoritedPost = await favoritePost(
          userId,
          postId,
          favoritesArray
        );
        return favoritedPost;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new Error(`Error favoriting post: ${(error as Error).message}`);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS, data],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER, data],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      postId: string;
      likesArray: string[];
    }) => {
      const { userId, postId, likesArray } = params;
      try {
        const likedPost = await likePost(postId, likesArray, userId);
        return likedPost;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new Error(`Error favoriting post: ${(error as Error).message}`);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS, data],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER, data],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId?: string }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DELETE_POST],
      });
    },
  });
};

export const useDeleteFavoritePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deleteFavoritePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetAllFavorites = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_FAVORITES, userId],
    queryFn: () => getFavoritedPosts(userId),
  });
};
