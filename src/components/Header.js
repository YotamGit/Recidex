import { Link } from "react-router-dom";
import "../styles/Header.css";
const Header = () => {
  return (
    <div className="header">
      <Link className="header-btn" to="/home">
        Home Page
      </Link>
      <Link className="header-btn" to="/recipes/new">
        Add Recipe
      </Link>
    </div>
  );
};

export default Header;
