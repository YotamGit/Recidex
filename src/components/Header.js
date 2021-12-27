import { Link } from "react-router-dom";
import "../styles/Header.css";

//icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const Header = () => {
  return (
    <div className="header">
      <Link className="header-btn" to="/home">
        <HomeRoundedIcon style={{ fontSize: "3.5vh" }} />
      </Link>
      <Link className="header-btn" to="/recipes/new">
        <AddCircleRoundedIcon style={{ fontSize: "3.5vh" }} />
      </Link>
    </div>
  );
};

export default Header;
