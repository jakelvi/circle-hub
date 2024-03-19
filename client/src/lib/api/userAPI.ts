import { INewUser, ILogin, IUpdateUser } from "@/types";
import { QUERY_KEYS, api } from "../react-query/queryKeys";
import {
  QueryOptions,
  handleTokenAfterLogin,
  orderDesc,
  clearLocalStorage,
} from "../../service/apiService";

export async function createUserAccount(user: INewUser) {
  try {
    const response = await api.post(QUERY_KEYS.CREATE_USER_ACCOUNT, user);

    const newUser = response.data;
    return newUser;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
}

// ============================== SIGN IN

export async function signInAccount(user: ILogin) {
  try {
    const response = await api.post(QUERY_KEYS.LOGIN_USER_ACOUNT, user);
    const { jwt } = response.data;
    const { username } = handleTokenAfterLogin(jwt);
    return { username, token: jwt };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    clearLocalStorage();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const response = await api.get(QUERY_KEYS.GET_CURRENT_USER);
    const currentUser = response.data;
    return currentUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// ============================== GET USERS
export async function getAllUsers(limit: number) {
  const queries: QueryOptions[] = [orderDesc("$createdAt")];

  try {
    const response = await api.get(`${QUERY_KEYS.GET_USERS}`, {
      params: { queries, limit },
    });
    const users = response.data.allUsers;
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const response = await api.get(`${QUERY_KEYS.GET_USER_BY_ID}/${userId}`);
    const user = response.data.user;
    return user;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

// ============================== UPDATE USER
export async function updateUser({
  userData,
  userId,
  file,
}: {
  userData: IUpdateUser;
  userId: string;
  file: File[] | null | undefined;
}) {
  try {
    const formData = new FormData();
    if (file && file.length > 0) {
      formData.append("file", file[0]);
    }

    formData.append("userData", JSON.stringify(userData));
    formData.append("userId", userId);

    const response = await api.put(
      `${QUERY_KEYS.UPDATE_USER}/${userId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function toggleFollow(followerId: string, followedId: string) {
  try {
    const response = await api.put(
      `${QUERY_KEYS.FOLLOW_USER}/${followerId}`,
      followedId
    );
    const { data, message } = response.data;
    return { data, message };
  } catch (error) {
    console.error("Error following/unfollowing the user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await api.delete(QUERY_KEYS.DELETE_USER + userId);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//reset password:

//reset email:
