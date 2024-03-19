import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContex";
import { IPost, IUser } from "@/types";

type PostCardProps = {
  post: IPost;
  user: IUser;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.userId) return null;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.userId}`}>
            <img
              src={
                user?.profileImage || "/assets/icons/profile-placeholder.svg"
              }
              alt="post-image"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {user?.name?.first}
            </p>
            <p className="base-medium lg:body-bold text-light-1">
              {user?.name?.middle ? user.name.middle : ""}
            </p>
            <p className="base-medium lg:body-bold text-light-1">
              {user?.name?.last}
            </p>
            <div className="flex-center gap-2 text-light-3">
              {isValidDate(post?.createdAt) && (
                <p className="subtle-semibold lg:small-regular">
                  {multiFormatDateString(post.createdAt.toISOString())}
                </p>
              )}
              •
              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post?._id}`}
          className={`${user.id !== post?._id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post?._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post?.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags &&
              Array.isArray(post?.tags) &&
              post?.tags.map((tag: string, index: number) => (
                <li
                  key={`${tag}${index}`}
                  className="text-light-3 small-regular">
                  #{tag}
                </li>
              ))}
          </ul>
        </div>

        <img
          src={post?.image || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user?.id} />
    </div>
  );
};

export default PostCard;
