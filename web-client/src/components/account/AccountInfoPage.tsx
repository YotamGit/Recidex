import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/account/AccountInfoPage.css";

import AccountInfoEditSection from "./AccountInfoEditSection";
import AccountInfoPreviewSection from "./AccountInfoPreviewSection";
import PageTitle from "../PageTitle";

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
    <div className="account-info-page">
      <PageTitle style={{ marginTop: "1rem" }} />

      {viewEditUser ? (
        <>
          <AccountInfoEditSection
            userData={userData}
            setViewEdit={setViewEdit}
          />
        </>
      ) : (
        <>
          <AccountInfoPreviewSection
            userData={userData}
            setViewEdit={setViewEdit}
          />
        </>
      )}
    </div>
  );
};

export default AccountInfoPage;
