import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestInterceptor = async (config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(requestInterceptor);
export { api };

export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "users/register",
  LOGIN_USER_ACOUNT = "users/login",

  // USER KEYS
  GET_CURRENT_USER = "users/getUser",
  GET_USER_BY_ID = "users/getUserById",
  GET_USERS = "users/getUsers",
  UPDATE_USER = "users/updateUser",
  RESET_PASSWORD = "users/resetPassword",
  RESET_EMAIL = "users/resetEmail",
  DELETE_USER = "users/deleteUser",
  FOLLOW_USER = "users/followUser",

  //OTP KEYS
  GENERATE_OTP_CODE = "users/:id/generateOTP",
  VERIFY_OTP_CODE = "users/verifyOTP",

  // POST KEYS
  CREATE_FILE = "posts/uploadFiles",
  CREATE_POST = "posts/createPosts",
  LIKE_POST = "posts/like",
  FAVORITE_POST = "posts/favorite",
  UPDATE_POST = "posts/updatePost",
  GET_USER_POSTS = "posts/getUserPosts",
  GET_POST_BY_ID = "posts/getPost",
  GET_ALL_FAVORITES = "posts/getFavorites",
  GET_ALL_POSTS = "posts/getPosts",
  GET_RECENT_POSTS = "posts/getRecentPosts",
  DELETE_POST = "posts/deletePost",
  GET_HIGHLY_LIKED_POST = "posts/getHighestLiked",
  DELETE_FAVORITE_POST = "posts/deleteFavoritePost",

  //  SEARCH KEYS
  SEARCH_POSTS = "posts/searchPosts",
}
