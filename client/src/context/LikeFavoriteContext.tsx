import React, { createContext, useContext, useState, useEffect } from "react";

interface ILikeFavoriteContext {
  likes: string[];
  favorites: string[];
  addLike: (postId: string) => void;
  removeLike: (postId: string) => void;
  addFavorite: (postId: string) => void;
  removeFavorite: (postId: string) => void;
}

const LikeFavoriteContext = createContext<ILikeFavoriteContext | undefined>(
  undefined
);

export const useLikeFavorite = () => {
  const context = useContext(LikeFavoriteContext);
  if (!context) {
    throw new Error(
      "useLikeFavorite must be used within a LikeFavoriteProvider"
    );
  }
  return context;
};

interface LikeFavoriteProviderProps {
  children: React.ReactNode;
}

export const LikeFavoriteProvider: React.FC<LikeFavoriteProviderProps> = ({
  children,
}) => {
  const [likes, setLikes] = useState<string[]>(() => {
    const storedLikes = localStorage.getItem("likes");
    return storedLikes ? JSON.parse(storedLikes) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const addLike = (postId: string) => {
    setLikes([...likes, postId]);
  };

  const removeLike = (postId: string) => {
    setLikes(likes.filter((id) => id !== postId));
  };

  const addFavorite = (postId: string) => {
    setFavorites([...favorites, postId]);
  };

  const removeFavorite = (postId: string) => {
    setFavorites(favorites.filter((id) => id !== postId));
  };

  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const contextValue: ILikeFavoriteContext = {
    likes,
    favorites,
    addLike,
    removeLike,
    addFavorite,
    removeFavorite,
  };

  return (
    <LikeFavoriteContext.Provider value={contextValue}>
      {children}
    </LikeFavoriteContext.Provider>
  );
};
