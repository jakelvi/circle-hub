import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContex";
import { IPost } from "@/types";

type GridPostListProps = {
  userId: string;
  showUser?: boolean;
  showStats?: boolean;
  posts: IPost[];
};

const GridPostList = ({
  userId,
  showUser = true,
  showStats = true,
  posts,
}: GridPostListProps) => {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!posts) {
    return <p>No posts found.</p>;
  }

  return (
    <ul className="grid-container">
      {posts.map((post: IPost) => (
        <li key={post?._id} className="grid-post-item relative min-w-80 h-80">
          <Link to={`/posts/${post?._id}`} className="grid-post_link">
            <img
              src={post?.image || "/assets/icons/profile-placeholder.svg"}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={user?.profileImage}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{user?.name.first}</p>
                <p className="line-clamp-1">
                  {user?.name.middle ? user.name.middle : ""}
                </p>
                <p className="line-clamp-1">{user?.name.last}</p>
              </div>
            )}
            {showStats && userId && <PostStats post={post} userId={user?.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
