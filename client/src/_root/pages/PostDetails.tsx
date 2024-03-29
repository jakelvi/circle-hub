import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  useGetUserPosts,
  useDeletePost,
  useGetPostById,
} from "../../lib/react-query/postQueries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "../../context/AuthContex";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: post, isLoading } = useGetPostById(id || "");
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.postId || ""
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.filter(
    (userPost: { id: string }) => userPost.id !== user.id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.image}
            alt="post-image"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    user?.profileImage ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {user?.name.first}
                  </p>
                  <p className="base-medium lg:body-bold text-light-1">
                    {user?.name.middle}
                  </p>
                  <p className="base-medium lg:body-bold text-light-1">
                    {user?.name.last}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?._id}`}
                  className={`${user.id !== post.userId && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`${user.id !== post.userId && "hidden"}`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags ? (
                  post.tags.map((tag: string, index: number) => (
                    <li
                      key={`${tag}${index}`}
                      className="text-light-3 small-regular">
                      {tag}
                    </li>
                  ))
                ) : (
                  <li>No tags found</li>
                )}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
