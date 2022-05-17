import { useState, useEffect, FC } from "react";
import AuthorizedButton from "../Login/AuthorizedButton";

//mui icons
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { favoriteRecipe } from "../../slices/recipesSlice";

interface propTypes {
  recipeId: string;
  favorited_by: string[];
  style?: any;
  showCount: boolean;
}

const Favorite: FC<propTypes> = ({
  recipeId,
  favorited_by,
  style,
  showCount,
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.users.userData._id || "");
  const [favorite, setFavorite] = useState(favorited_by.includes(userId));

  //update favorite color if the user logs out
  useEffect(() => {
    setFavorite(favorited_by.includes(userId));
  }, [userId, favorited_by]);

  const toggleFavorite = async () => {
    let favRes = await dispatch(
      favoriteRecipe({ id: recipeId, favorite: !favorite })
    );

    if (favRes.meta.requestStatus === "fulfilled") {
      setFavorite(!favorite);
    }
  };

  return (
    <AuthorizedButton type={"icon"} onClick={toggleFavorite} style={style}>
      {showCount && (
        <span
          style={{
            color: favorite ? "rgb(255, 93, 85)" : "gray",
            fontSize: "20px",
          }}
        >
          {favorited_by.length}
        </span>
      )}
      <FavoriteRoundedIcon
        className="icon"
        style={{ color: favorite ? "rgb(255, 93, 85)" : "gray" }}
      />
    </AuthorizedButton>
  );
};

export default Favorite;
