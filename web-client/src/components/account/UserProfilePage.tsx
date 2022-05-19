import { useParams } from "react-router-dom";

//types
import { FC } from "react";
import UserProfile from "./UserProfile";

const UserProfilePage: FC = () => {
  const { user_id } = useParams();
  return (
    <>
      {"TOP BUTTON ROW"}
      <UserProfile user_id={user_id} />
    </>
  );
};

export default UserProfilePage;
