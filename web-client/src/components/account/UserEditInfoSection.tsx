//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

interface propTypes {
  userData: User;
}
const UserEditInfoSection: FC<propTypes> = ({ userData }) => {
  // const [_id, setId] = useState(
  //   useAppSelector((state) => state.users.userData._id)
  // );
  // const [username, setUsername] = useState(
  //   useAppSelector((state) => state.users.userData.username)
  // );
  // const [firstname, setFirstname] = useState(
  //   useAppSelector((state) => state.users.userData.firstname)
  // );
  // const [lastname, setLastname] = useState(
  //   useAppSelector((state) => state.users.userData.lastname)
  // );
  // const [email, setEmail] = useState(
  //   useAppSelector((state) => state.users.userData.email)
  // );
  return <div>{JSON.stringify(userData)}</div>;
};

export default UserEditInfoSection;
