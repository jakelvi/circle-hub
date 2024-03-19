import { Loader, PostCard, UserCard } from "@/components/shared";
import { useUserContext } from "@/context/AuthContex";
import { useGetRecentPosts } from "@/lib/react-query/postQueries";
import { useGetUsers } from "@/lib/react-query/userQueries";
import { IPost, IUser } from "@/types";

type Creator = IUser & { _id: string };

const Home = () => {
  const { user } = useUserContext();
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.map((post: IPost, index: number) => (
                <li
                  key={post?._id ?? index}
                  className="flex justify-center w-full">
                  <PostCard post={post} user={user} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.map((creator: Creator, index: number) => (
              <li key={creator._id ?? index}>
                <UserCard user={user} creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
