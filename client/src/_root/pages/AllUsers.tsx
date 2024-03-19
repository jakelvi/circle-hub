import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/userQueries";
import { IUser } from "@/types";
import { useUserContext } from "@/context/AuthContex";
type Creator = IUser & { _id: string };
const AllUsers = () => {
  const { toast } = useToast();
  const { user } = useUserContext();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return null;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator: Creator) => (
              <li key={creator._id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={user} creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
