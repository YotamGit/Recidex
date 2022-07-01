import { useState } from "react";

import GenericPromptDialog from "../utilities/GenericPromptDialog";

import { requestApproval, changePrivacy } from "../../slices/recipesSlice";
//redux
import { useAppDispatch } from "../../hooks";
//mui
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

//mui icons
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import FlakyIcon from "@mui/icons-material/Flaky";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  kind: "privacy" | "approval";
  recipe: TRecipe;
  handleCloseDialog?: Function;
}
const RecipePrivacyApprovalMenuButton: FC<propTypes> = ({
  kind,
  recipe,
  handleCloseDialog,
}) => {
  const dispatch = useAppDispatch();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async () => {
    setDisabled(true);
    if (kind === "approval") {
      dispatch(
        requestApproval({
          _id: recipe._id as string,
          approval_required: !recipe.approval_required,
        })
      );
    } else if (kind === "privacy") {
      dispatch(
        changePrivacy({
          _id: recipe._id as string,
          private: !recipe.private,
        })
      );
    }

    setDisabled(false);
  };
  return (
    <>
      {kind === "privacy" && (
        <MenuItem
          onClick={() => setOpenConfirmDialog(true)}
          disabled={disabled}
        >
          <ListItemIcon>
            <PrivacyTipRoundedIcon />
          </ListItemIcon>
          {recipe.private ? "Make Public" : "Make Private"}
        </MenuItem>
      )}
      {kind === "approval" && !recipe.private && !recipe.approved && (
        <MenuItem
          onClick={() => setOpenConfirmDialog(true)}
          disabled={disabled}
        >
          <ListItemIcon>
            <FlakyIcon />
          </ListItemIcon>
          {recipe.approval_required
            ? "Cancel Approval Request"
            : "Request Approval"}
        </MenuItem>
      )}
      <GenericPromptDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        onConfirm={onSubmit}
        onCancel={() => {
          handleCloseDialog && handleCloseDialog();
        }}
        title={
          kind === "approval"
            ? "Request Approval?"
            : recipe.private
            ? "Make Public?"
            : "Make Private?"
        }
        text={
          kind === "approval"
            ? `Request approval for recipe: "${recipe.title}"\nBy: ${recipe.owner?.firstname} ${recipe.owner?.lastname}?`
            : `Make recipe: "${recipe.title}"\nBy: ${recipe.owner?.firstname} ${
                recipe.owner?.lastname
              } ${recipe.private ? "Public" : "Private"}?`
        }
      />
    </>
  );
};

export default RecipePrivacyApprovalMenuButton;
