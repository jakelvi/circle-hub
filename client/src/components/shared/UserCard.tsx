import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { IUser } from "@/types";
import Loader from "@/components/shared/Loader";

type Creator = IUser & { _id: string };

type UserCardProps = {
  user: IUser;
  creator: Creator;
};

const UserCard = ({ user, creator }: UserCardProps) => {
  if (!creator._id) {
    return <Loader />;
  }

  return (
    <Link to={`/profile/${creator._id}`} className="user-card">
      <img
        src={creator?.profileImage || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {creator.name.first}
        </p>
        {creator.name.middle && (
          <p className="body-bold">{creator.name.middle}</p>
        )}
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {creator.name.last}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{creator.username}
        </p>
      </div>

      {user.id !== creator._id && (
        <Button type="button" size="sm" className="shad-button_primary px-5">
          Follow
        </Button>
      )}
    </Link>
  );
};

export default UserCard;
