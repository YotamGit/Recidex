import { useEffect, useState } from "react";
import "../../styles/account/AccountInfoPage.css";
import UserInfoEditSection from "./UserInfoEditSection";
import UserInfoPreviewSection from "./UserInfoPreviewSection";

//mui
import { Button } from "@mui/material";

//redux
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";

const AccountInfoPage: FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.users.userData);
  const [viewEditUser, setViewEdit] = useState(false);

  return (
    <div>
      {viewEditUser ? (
        <>
          <UserInfoEditSection userData={userData} setViewEdit={setViewEdit} />
        </>
      ) : (
        <>
          <UserInfoPreviewSection
            userData={userData}
            setViewEdit={setViewEdit}
          />
        </>
      )}
    </div>
  );
};

export default AccountInfoPage;
