import { useState } from "react";

//mui
import IconButton from "@mui/material/IconButton";
//mui icons
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { favoriteRecipe } from "../slices/recipesSlice";

const Favorite = ({ recipeId, favorited_by }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.userId);
  const [favorite, setFavorite] = useState(favorited_by.includes(userId));

  const toggleFavorite = async () => {
    var favRes = await dispatch(
      favoriteRecipe({ recipeId, favorite: !favorite })
    );
    if (!favRes.error) {
      setFavorite(!favorite);
    }
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
