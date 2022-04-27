import { useState, useEffect } from "react";
import AuthorizedButton from "./Login/AuthorizedButton";

//mui
import IconButton from "@mui/material/IconButton";
//mui icons
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { favoriteRecipe } from "../slices/recipesSlice";

const Favorite = ({ recipeId, favorited_by, style, showCount }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.userId);
  const [favorite, setFavorite] = useState(favorited_by.includes(userId));

  //update favorite color if the user logs out
  useEffect(() => {
    setFavorite(favorited_by.includes(userId));
  }, [userId]);

  const toggleFavorite = async () => {
    var favRes = await dispatch(
      favoriteRecipe({ recipeId, favorite: !favorite })
    );
    if (!favRes.error) {
      setFavorite(!favorite);
    }
  };

  return (
    <AuthorizedButton
      type={"icon"}
      onClick={toggleFavorite}
      style={{ ...style, displa: "flex", alignItems: "flex-end" }}
    >
      {showCount && (
        <span style={{ color: favorite ? "red" : "gray", fontSize: "20px" }}>
          {favorited_by.length}
        </span>
      )}
      <FavoriteRoundedIcon style={{ color: favorite ? "red" : "gray" }} />
    </AuthorizedButton>
  );
};

export default Favorite;
