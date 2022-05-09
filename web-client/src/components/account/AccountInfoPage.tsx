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
  const [user, setUser] = useState<FullUser>();

  useEffect(() => {
    // dispatch(getUsers({}));
  }, []);

  return <div>{userId}</div>;
};

export default AccountInfoPage;
