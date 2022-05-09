import { useEffect, useState } from "react";

//mui
import { Button } from "@mui/material";

//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

interface propTypes {
  userData: User;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfoPreviewSection: FC<propTypes> = ({ userData, setViewEdit }) => {
  return (
    <div className="user-info-preview-section">
      <Button variant="contained" onClick={() => setViewEdit(true)}>
        Edit Info
      </Button>
      <div className="info-container">
        <div>
          <div className="title">Username</div>
          <div className="info">{userData.username}</div>
        </div>
        <div>
          <div className="title">First Name</div>
          <div className="info">{userData.firstname}</div>
        </div>
        <div>
          <div className="title">Last Name</div>
          <div className="info">{userData.lastname}</div>
        </div>
        <div>
          <div className="title">Email</div>
          <div className="info">{userData.email}</div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPreviewSection;
