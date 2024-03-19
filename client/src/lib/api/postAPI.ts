import { INewPost, IUpdatePost } from "@/types";

import { QUERY_KEYS, api } from "../react-query/queryKeys";

export async function uploadFile(files: File[]) {
  try {
    const fileData = new FormData();
    files.forEach((file) => {
      fileData.append("file", file);
    });

    const response = await api.post(QUERY_KEYS.CREATE_FILE, fileData);
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}

export async function createPost(postData: INewPost) {
  try {
    const postDataToSend = { ...postData };
    if (postDataToSend.file) {
      const file = postDataToSend.file;
      const imageResponse = await uploadFile(file);

      const image = imageResponse.imageUrl;
      postDataToSend.image = image;
      delete postDataToSend.file;

      const response = await api.post(QUERY_KEYS.CREATE_POST, postDataToSend);
      return response.data;
    } else {
      const response = await api.post(QUERY_KEYS.CREATE_POST, postDataToSend);
      return response.data;
    }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// ============================== GET POSTS
export async function searchPosts(tag: string) {
  try {
    const response = await api.get(
      `${QUERY_KEYS.SEARCH_POSTS}?searchTerm=${encodeURIComponent(tag)}`
    );

    const { posts } = response.data;
    return posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Failed to search posts");
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", pageParam.toString());
  queryParams.append("limit", "9");

  try {
    const response = await api.get(
      `${QUERY_KEYS.GET_ALL_POSTS}?${queryParams.toString()}`
    );
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching infinite posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId: string) {
  try {
    const response = await api.get(`${QUERY_KEYS.GET_POST_BY_ID}/${postId}`);
    const post = response.data.post;
    return post;
  } catch (error) {
    console.error("Error fetching user's post:", error);
    throw error;
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return [];

  try {
    const response = await api.get(`${QUERY_KEYS.GET_USER_POSTS}/${userId}`);
    const posts = response.data || [];
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}

// ============================== UPDATE POST

export async function updatePost(updatePostData: IUpdatePost) {
  try {
    const postDataToSend = { ...updatePostData };
    if (postDataToSend.file && postDataToSend.file.length >> 0) {
      const file = postDataToSend.file;
      const imageResponse = await uploadFile(file);

      const image = imageResponse.imageUrl;
      postDataToSend.image = image;
      delete postDataToSend.file;

      const response = await api.put(QUERY_KEYS.UPDATE_POST, postDataToSend);
      return response.data;
    } else {
      delete postDataToSend.file;
      const response = await api.put(QUERY_KEYS.UPDATE_POST, postDataToSend);
      return response.data;
    }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string) {
  if (!postId) return;

  try {
    const deletePost = await api.delete(`${QUERY_KEYS.DELETE_POST}/${postId}`);

    if (!deletePost) {
      throw new Error("Failed to delete post");
    }

    return { status: "Ok" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(
  postId: string,
  likesArray: string[],
  userId: string
) {
  try {
    const likedPost = await api.post(`${QUERY_KEYS.LIKE_POST}/${postId}`, {
      userId: userId,
      likes: likesArray,
    });
    if (!likedPost) {
      throw new Error("Failed to like post");
    }
    return likedPost;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

// ============================== favorite unfavorite POST
export async function favoritePost(
  userId: string,
  postId: string,
  favoritesArray: string[]
) {
  try {
    const favoritePost = await api.post(
      `${QUERY_KEYS.FAVORITE_POST}/${postId}`,
      {
        userId: userId,
        favorites: favoritesArray,
      }
    );

    if (!favoritePost) {
      throw new Error("Failed to favorite post");
    }
    return favoritePost;
  } catch (error) {
    console.error("Error favoriting post:", error);
    throw error;
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getHighlyLikedPost(userId: string) {
  try {
    const posts = await api.get(`${QUERY_KEYS.GET_HIGHLY_LIKED_POST}${userId}`);

    if (!posts) {
      throw new Error("Failed to fetch popular posts");
    }

    return posts;
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    throw error;
  }
}

export async function getRecentPosts() {
  try {
    const response = await api.get(`${QUERY_KEYS.GET_RECENT_POSTS}`, {
      params: {
        orderBy: "$createdAt",
        limit: 20,
      },
    });
    if (!response.data) throw new Error("No recent posts found");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedPosts = response.data.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (post: { _id: any; createdAt: string | number | Date }) => {
        return {
          ...post,
          id: post._id,
          createdAt: new Date(post.createdAt).toISOString(),
        };
      }
    );

    return formattedPosts;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    throw error;
  }
}

export async function getFavoritedPosts(userId: string) {
  try {
    const response = await api.get(`${QUERY_KEYS.GET_ALL_FAVORITES}/${userId}`);
    const favoritedPosts = response.data.favorites;

    return favoritedPosts !== undefined && favoritedPosts !== null
      ? { data: favoritedPosts, isSuccess: true }
      : { data: [], isSuccess: true };
  } catch (error) {
    console.error("Error fetching favorited posts:", error);
    return {
      data: [],
      error: "Failed to fetch favorited posts",
      isSuccess: false,
    };
  }
}

export async function deleteFavoritePost(postId: string) {
  try {
    const statusCode = await api.delete(
      `${QUERY_KEYS.DELETE_FAVORITE_POST}/${postId}`
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.error(error);
  }
}
