import { useState, useEffect, FC } from "react";
import AuthorizedButton from "../login/AuthorizedButton";

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
  const [localFavoritedBy, setlocalFavoritedBy] = useState(favorited_by);
  const [disableFavorite, setDisableFavorite] = useState(false);

  useEffect(() => {
    setlocalFavoritedBy(favorited_by);
  }, [favorited_by]);

  //update favorite color if the user logs out
  useEffect(() => {
    setFavorite(localFavoritedBy.includes(userId));
  }, [userId, localFavoritedBy]);

  const toggleFavorite = async () => {
    setDisableFavorite(true);

    let favRes = await dispatch(
      favoriteRecipe({ id: recipeId, favorite: !favorite })
    );

    if (favRes.meta.requestStatus === "fulfilled") {
      let payload: any = favRes.payload;
      setlocalFavoritedBy(payload.favorited_by);
      setFavorite(!favorite);
    }
    setDisableFavorite(false);
  };

  return (
    <AuthorizedButton
      type={"icon"}
      onClick={toggleFavorite}
      style={style}
      disabled={disableFavorite}
    >
      {showCount && (
        <span
          style={{
            color: favorite ? "rgb(255, 93, 85)" : "gray",
            fontSize: "20px",
          }}
        >
          {localFavoritedBy.length}
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
