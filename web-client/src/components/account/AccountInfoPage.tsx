import { useEffect, useState } from "react";
import "../../styles/account/AccountInfoPage.css";
//redux
import { getUsers } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FullUser } from "../../slices/usersSlice";
import { FC } from "react";

const AccountInfoPage: FC = () => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.users.userData._id);
  const users = useAppSelector((state) => state.users.users);
  const [user, setUser] = useState<FullUser>();

  useEffect(() => {
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    console.log(users);
    console.log(users.filter((user) => user._id === userId));
    setUser(users.filter((user) => user._id === userId) as unknown as FullUser);
  }, [users, userId]);

  return <div>{JSON.stringify(user)}</div>;
};

export default AccountInfoPage;
