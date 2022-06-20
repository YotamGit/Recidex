import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/account/AccountInfoPage.css";

import AccountInfoEditSection from "./AccountInfoEditSection";
import AccountInfoPreviewSection from "./AccountInfoPreviewSection";
import PageTitle from "../utilities/PageTitle";

import { getAccountInfo } from "../../utils-module/users";

//mui
import { Button } from "@mui/material";

//redux
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

const AccountInfoPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userId = useAppSelector((state) => state.users.userData._id);
  const [accountData, setAccountData] = useState<User>();
  const signedIn = useAppSelector((state) => state.users.signedIn);
  const attemptSignIn = useAppSelector((state) => state.users.attemptSignIn);

  const [updateAccountData, setUpdateAccountData] = useState<boolean>(true);
  const [viewEditUser, setViewEdit] = useState(false);

  useEffect(() => {
    if (attemptSignIn) {
      return;
    }
    if (!signedIn) {
      navigate("/home");
      return;
    }
    if (updateAccountData) {
      getAccountInfo(userId || "").then((res: any) => {
        if (res) {
          setAccountData(res);
          setUpdateAccountData(false);
        }
      });
    }
  }, [signedIn, updateAccountData]);

  return (
    <div className="account-info-page">
      <PageTitle marginTop={true} />
      {accountData && (
        <>
          {viewEditUser ? (
            <>
              <AccountInfoEditSection
                userData={accountData}
                setViewEdit={setViewEdit}
                onEdit={() => setUpdateAccountData(true)}
              />
            </>
          ) : (
            <>
              <AccountInfoPreviewSection
                userData={accountData}
                setViewEdit={setViewEdit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AccountInfoPage;
