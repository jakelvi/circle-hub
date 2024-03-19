import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useFavoritePost,
} from "../../lib/react-query/postQueries";
import { useGetCurrentUser } from "@/lib/react-query/userQueries";
import { IPost } from "@/types";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const [likes, setLikes] = useState<string[]>(
    post.likes?.map((like) => like.userId) ?? []
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { mutate: likePost } = useLikePost();
  const { mutate: favoritePost } = useFavoritePost();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const isLikedStored = localStorage.getItem("isLiked");
      if (isLikedStored !== null) {
        setIsLiked(JSON.parse(isLikedStored));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(checkIsLiked(likes, userId));
      localStorage.setItem("isLiked", JSON.stringify(isLiked));
    }
  }, [likes, userId, isLiked, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const isFavoriteStored = localStorage.getItem("isFavorite");
      if (isFavoriteStored !== null) {
        setIsFavorite(JSON.parse(isFavoriteStored));
      }
    }
  }, [currentUser]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    setIsLiked(!isLiked);
    likePost({ userId, likesArray: updatedLikes, postId: post?._id });
  };

  const handleFavoritePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    setIsFavorite(!isFavorite);

    const updatedFavorites = favorites.includes(userId)
      ? favorites.filter((id) => id !== userId)
      : [...favorites, userId];

    setFavorites(updatedFavorites);
    favoritePost({
      postId: post?._id,
      favoritesArray: updatedFavorites,
      userId,
    });

    localStorage.setItem("isFavorite", JSON.stringify(!isFavorite));
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("isFavorite", JSON.stringify(isFavorite));
    }
  }, [isFavorite, currentUser]);

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={`${
            isFavorite ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
          }`}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleFavoritePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;
