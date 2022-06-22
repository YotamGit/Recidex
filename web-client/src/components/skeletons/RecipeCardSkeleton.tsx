import "../../styles/skeletons/RecipeCardSkeleton.css";
//mui
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

//types
import { FC } from "react";

interface propTypes {
  kind: "regular" | "moderation";
}
const RecipeCardSkeleton: FC<propTypes> = ({ kind }) => {
  return (
    <div className={`recipe-card-skeleton ${kind}`}>
      <Skeleton variant="text" width="30%" height="30px" />
      <Skeleton variant="text" width="50%" height="30px" />
      <Divider variant="middle" />

      {kind === "regular" && (
        <>
          <div className="chips-skeleton">
            <Skeleton variant="text" width="50px" height="40px" />
            <Skeleton variant="text" width="50px" height="40px" />
            <Skeleton variant="text" width="50px" height="40px" />
          </div>
          <div className="description-skeleton">
            <Skeleton variant="text" width="90%" height="20px" />
            <Skeleton variant="text" width="70%" height="20px" />
          </div>
          <Skeleton className="image-skeleton" variant="rectangular" />
        </>
      )}
      <div className="additional-data-skeleton">
        <span className="additional-data-field-skeleton">
          <Skeleton variant="circular" width="25px" height="25px" />
          <Skeleton variant="text" width="60px" height="30px" />
        </span>
        {kind === "regular" && (
          <>
            <span className="additional-data-field-skeleton">
              <Skeleton variant="circular" width="25px" height="25px" />
              <Skeleton variant="text" width="60px" height="30px" />
            </span>
            <span className="additional-data-field-skeleton">
              <Skeleton variant="circular" width="25px" height="25px" />
              <Skeleton variant="text" width="60px" height="30px" />
            </span>
          </>
        )}
      </div>
      {kind === "moderation" && (
        <div className="approve-buttons-skeleton">
          <Skeleton variant="rectangular" width="90px" height="35px" />
          <Skeleton variant="rectangular" width="90px" height="35px" />
        </div>
      )}
    </div>
  );
};

export default RecipeCardSkeleton;
