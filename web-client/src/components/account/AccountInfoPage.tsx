import { useEffect, useState } from "react";
import "../../styles/account/AccountInfoPage.css";
import UserEditInfoSection from "./UserEditInfoSection";

//redux
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";

const AccountInfoPage: FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.users.userData);

  return (
    <div>
      <UserEditInfoSection userData={userData} />
    </div>
  );
};

export default AccountInfoPage;
