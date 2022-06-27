import "../../styles/recipe_moderation/ModerationRecipeCard.css";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import UserProfileLink from "../account/UserProfileLink";
import GenericPromptDialog from "../utilities/GenericPromptDialog";

//mui
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";

//mui icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

//redux
import { useAppDispatch } from "../../hooks";
import { approveRecipe } from "../../slices/recipesSlice";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

interface propTypes {
  recipe: TRecipe;
}
const ModerationRecipeCard: FC<propTypes> = ({ recipe }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [disapproveReason, setDisapproveReason] = useState<
    string | undefined
  >();
  const [openModModal, setOpenModModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [disableButton, setDisableButton] = useState(false);

  const onApprove = async (approve: boolean, reason?: string) => {
    setDisableButton(true);
    let approveRes = await dispatch(
      approveRecipe({
        _id: recipe._id as string,
        approve: approve,
        reason: disapproveReason,
      })
    );
    if (approveRes.meta.requestStatus === "rejected") {
      setDisableButton(false);
    }
  };

  return (
    <div className="moderation-recipe-card">
      <div className="top-button-row" style={{ margin: "1%" }}>
        <Link to={`/recipes/${recipe._id}`} style={{ lineHeight: 0 }}>
          <Tooltip title="Expand recipe" arrow>
            <OpenInFullRoundedIcon className="icon" />
          </Tooltip>
        </Link>
        <Link to={`/recipes/edit/${recipe._id}`} style={{ lineHeight: 0 }}>
          <Tooltip title="Edit recipe" arrow>
            <EditRoundedIcon className="icon" />
          </Tooltip>
        </Link>
      </div>
      <div
        className="recipe-title"
        onClick={() => navigate(`/recipes/${recipe._id}`)}
      >
        {recipe.title}
      </div>
      <div className="recipe-data-dates">
        <span className="recipe-data-date">
          <span>Created: </span>
          {recipe.creation_time &&
            new Date(recipe.creation_time).toLocaleString("he-IL", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
        </span>

        <Divider orientation="vertical" variant="middle" />
        <span className="recipe-data-date">
          <span>Updated: </span>
          {recipe.last_update_time &&
            new Date(recipe.last_update_time).toLocaleString("he-IL", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
        </span>
      </div>
      <Divider variant="middle" />

      {recipe.owner && <UserProfileLink owner={recipe.owner} />}
      <div className="bottom-button-row">
        <LoadingButton
          loading={disableButton}
          className="approve-button"
          variant="contained"
          style={{ backgroundColor: "rgb(255, 93, 85)" }}
          onClick={() => setOpenModModal(true)}
        >
          disapprove
        </LoadingButton>
        <LoadingButton
          loading={disableButton}
          className="approve-button"
          variant="contained"
          style={{ backgroundColor: "rgb(117, 219, 104)" }}
          onClick={() => setOpenConfirmDialog(true)}
        >
          approve
        </LoadingButton>
      </div>
      <GenericPromptDialog
        open={openModModal}
        setOpen={setOpenModModal}
        onConfirm={() => onApprove(false)}
        onCancel={() => setDisapproveReason(undefined)}
        title="Disapprove Recipe?"
        text={`Disapprove recipe: "${recipe.title}"\nBy: ${recipe.owner?.firstname} ${recipe.owner?.lastname}?\n\nState reason for disapproving the recipe and what changes are needed.`}
        content={
          <TextField
            autoFocus
            fullWidth
            label="Reason"
            variant="standard"
            onChange={(e) => setDisapproveReason(e.target.value)}
          />
        }
      />
      <GenericPromptDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        onConfirm={() => onApprove(true)}
        title="Approve Recipe?"
        text={`Approve recipe: "${recipe.title}"\nBy: ${recipe.owner?.firstname} ${recipe.owner?.lastname}?`}
      />
    </div>
  );
};

export default ModerationRecipeCard;
