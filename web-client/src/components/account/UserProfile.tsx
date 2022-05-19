//types
import { FC } from "react";

interface propTypes {
  user_id?: string;
}
const UserProfile: FC<propTypes> = ({ user_id }) => {
  return <div>{user_id}</div>;
};

export default UserProfile;
