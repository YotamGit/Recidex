import { useEffect, useState } from "react";

//mui
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

interface propTypes {
  userData: User;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfoPreviewSection: FC<propTypes> = ({ userData, setViewEdit }) => {
  return (
    <div className="account-info-preview-section">
      <Button
        className="edit-button"
        variant="outlined"
        onClick={() => setViewEdit(true)}
      >
        Edit Info
      </Button>
      <div className="info-container">
        <div className="info-user">
          <div>
            <div className="title">Username</div>
            <div className="data">{userData.username}</div>
          </div>
          <div>
            <div className="title">Role</div>
            <div className="data">{userData.role}</div>
          </div>
        </div>
        <Divider />
        <div className="info-name">
          <div>
            <div className="title">First Name</div>
            <div className="data">{userData.firstname}</div>
          </div>
          <div>
            <div className="title">Last Name</div>
            <div className="data">{userData.lastname}</div>
          </div>
        </div>
        <Divider />
        <div className="info-email">
          <div className="title">Email</div>
          <div className="data">{userData.email}</div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPreviewSection;
