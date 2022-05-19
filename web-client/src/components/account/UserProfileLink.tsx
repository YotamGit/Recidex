import "../../styles/account/UserProfileLink.css";
import { useNavigate } from "react-router-dom";

//mui icons
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";

//types
import { FC } from "react";
import { Tooltip } from "@mui/material";

interface propTypes {
  owner: {
    firstname: string;
    lastname: string;
    _id: string;
  };
}
const UserProfileLink: FC<propTypes> = ({ owner }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title={"Owner"} arrow>
      <div
        className="user-profile-link"
        onClick={() => navigate(`/user/profile/${owner._id}`)}
      >
        <FaceRoundedIcon className="icon" />
        <span className="user-data" dir="auto">
          {owner.firstname + " " + owner.lastname}
        </span>
      </div>
    </Tooltip>
  );
};

export default UserProfileLink;
