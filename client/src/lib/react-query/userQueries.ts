import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { INewUser, IUpdateUser } from "@/types";
import {
  createUserAccount,
  getAllUsers,
  getCurrentUser,
  getUserById,
  signInAccount,
  signOutAccount,
  updateUser,
} from "../api/userAPI";
import { QUERY_KEYS } from "./queryKeys";
import { useUserContext } from "@/context/AuthContex";

// AUTH QUERIES

export const useCreateUserAccount = () => {
  const { setUser } = useUserContext();

  return useMutation({
    mutationFn: async (user: INewUser) => {
      try {
        const newUser = await createUserAccount(user);
        setUser(newUser);
        return newUser;
      } catch (error) {
        console.error("Error creating user account:", error);
        throw error;
      }
    },
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (credentials: {
      email?: string;
      username?: string;
      password: string;
    }) => signInAccount(credentials),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getAllUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userData,
      userId,
      file,
    }: {
      userData: Omit<IUpdateUser, "userId">;
      userId: string;
      file: File[] | null | undefined;
    }) => {
      try {
        return await updateUser({ userData, userId, file });
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.UPDATE_USER, data.userId],
      });
    },
  });
};
