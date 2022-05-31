import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const userData = useAppSelector((state) => state.users.userData);
  const signedIn = useAppSelector((state) => state.users.signedIn);
  const attemptSignIn = useAppSelector((state) => state.users.attemptSignIn);

  const [viewEditUser, setViewEdit] = useState(false);

  useEffect(() => {
    if (attemptSignIn) {
      return;
    }
    if (!signedIn) {
      navigate("/home");
    }
  }, [signedIn]);

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
