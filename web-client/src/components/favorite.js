import { useState } from "react";

//mui
import IconButton from "@mui/material/IconButton";
//mui icons
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

//redux
import { useSelector, useDispatch } from "react-redux";

const Favorite = ({ recipeId }) => {
  const userId = useSelector((state) => state.users.userId);
  const [favorite, setFavorite] = useState(false);
  const toggleFavorite = () => {
    try {
      setFavorite(!favorite);
    } catch (error) {}
  };
  return (
    <div>
      <IconButton onClick={toggleFavorite}>
        <FavoriteRoundedIcon style={{ color: favorite ? "red" : "gray" }} />
      </IconButton>
    </div>
  );
};

export default Favorite;
