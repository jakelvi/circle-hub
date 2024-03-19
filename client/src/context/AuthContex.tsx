import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/api/userAPI";
import { INITIAL_USER } from "@/constants";
import { QUERY_KEYS, api } from "@/lib/react-query/queryKeys";

interface IAuthContext {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  postId: string | null;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId: React.Dispatch<React.SetStateAction<string | null>>;
  checkAuthUser: () => Promise<boolean>;
  generateOTP: (userId: string) => Promise<string>;
}

const INITIAL_STATE: IAuthContext = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  postId: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  setPostId: () => {},
  checkAuthUser: async () => false as boolean,
  generateOTP: async (userId: string) => {
    try {
      const response = await api.get(QUERY_KEYS.GENERATE_OTP_CODE + userId);
      return response.data.generatedOTP;
    } catch (error) {
      throw new Error("Failed to generate OTP");
    }
  },
};

const AuthContext = createContext<IAuthContext>(INITIAL_STATE);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem("authState");
    return savedAuthState ? JSON.parse(savedAuthState).isAuthenticated : false;
  });

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        const userData = currentAccount.user;
        setUser({
          id: userData._id,
          name: {
            first: userData.name.first,
            middle: userData.name.middle,
            last: userData.name.last,
          },
          username: userData.username,
          email: userData.email,
          profileImage: userData.profileImage,
          bio: userData.bio,
          post: [],
          following: [],
          followers: [],
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/sign-in");
    } else {
      checkAuthUser();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify({ isAuthenticated }));
  }, [isAuthenticated]);

  const value: IAuthContext = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    postId,
    setPostId,
    setIsAuthenticated,
    checkAuthUser,
    generateOTP: INITIAL_STATE.generateOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
