import React, { useEffect } from "react";
import { GridPostList, Loader } from "@/components/shared";
import { useUserContext } from "@/context/AuthContex";
import { useGetAllFavorites } from "@/lib/react-query/postQueries";
import { IPost } from "@/types";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isLoading, refetch } = useGetAllFavorites(user?.id);

  useEffect(() => {
    refetch();
  }, [user?.id, refetch]);

  useEffect(() => {}, [savedPosts]);

  useEffect(() => {}, [isLoading]);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isLoading ? (
        <Loader />
      ) : !savedPosts || savedPosts?.data.length === 0 ? (
        <p className="text-light-4">No available posts</p>
      ) : (
        <GridPostList
          posts={savedPosts?.data.map((post: IPost) => ({
            ...post,
            creator: {
              userId: post?.userId,
              profileImage: user?.profileImage,
            },
          }))}
          userId={user?.id}
        />
      )}
    </div>
  );
};

export default Saved;
