import { useState } from "react";
import GenericPromptDialog from "../utilities/GenericPromptDialog";

//mui
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

//mui icons
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

//redux
import { useAppDispatch } from "../../hooks";
import { approveRecipe } from "../../slices/recipesSlice";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
interface propTypes {
  kind: "approve" | "disapprove";
  type: "button" | "listItem";
  recipe: TRecipe;
  setRecipe?: (updatedRecipe: TRecipe) => void;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  handleCloseDialog?: Function;
  fromModerationPage: boolean;
}
const RecipeModerationButton: FC<propTypes> = ({
  kind,
  type,
  recipe,
  setRecipe,
  setDisabled,
  disabled,
  handleCloseDialog,
  fromModerationPage,
}) => {
  const dispatch = useAppDispatch();

  const [openDisapproveDialog, setOpenDisapproveDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const [disapproveReason, setDisapproveReason] = useState<
    string | undefined
  >();

  const onApprove = async (approve: boolean, reason?: string) => {
    setDisabled(true);
    let approveRes = await dispatch(
      approveRecipe({
        _id: recipe._id as string,
        approve: approve,
        reason: disapproveReason,
        fromModerationPage: fromModerationPage,
      })
    );
    if (approveRes.meta.requestStatus === "fulfilled" && setRecipe) {
      setRecipe(approveRes.payload as TRecipe);
    }
    if (!fromModerationPage) {
      setDisabled(false);
    }
  };

  return (
    <div>
      {type === "button" && (
        <LoadingButton
          loading={disabled}
          className="approve-button"
          variant="contained"
          style={{
            backgroundColor:
              kind === "approve" ? "rgb(117, 219, 104)" : "rgb(255, 93, 85)",
          }}
          onClick={() =>
            kind === "approve"
              ? setOpenApproveDialog(true)
              : setOpenDisapproveDialog(true)
          }
        >
          {kind}
        </LoadingButton>
      )}
      {type === "listItem" && (
        <MenuItem
          onClick={() =>
            kind === "approve"
              ? setOpenApproveDialog(true)
              : setOpenDisapproveDialog(true)
          }
          disabled={disabled}
        >
          <ListItemIcon>
            {kind === "approve" ? (
              <CheckCircleOutlineRoundedIcon />
            ) : (
              <BlockIcon />
            )}
          </ListItemIcon>
          {kind === "approve" ? "Approve" : "Disapprove"} Recipe
        </MenuItem>
      )}
      <GenericPromptDialog
        open={openDisapproveDialog}
        setOpen={setOpenDisapproveDialog}
        onConfirm={() => onApprove(false)}
        onCancel={() => {
          setDisapproveReason(undefined);
          handleCloseDialog && handleCloseDialog();
        }}
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
        open={openApproveDialog}
        setOpen={setOpenApproveDialog}
        onConfirm={() => onApprove(true)}
        onCancel={() => {
          handleCloseDialog && handleCloseDialog();
        }}
        title="Approve Recipe?"
        text={`Approve recipe: "${recipe.title}"\nBy: ${recipe.owner?.firstname} ${recipe.owner?.lastname}?`}
      />
    </div>
  );
};

export default RecipeModerationButton;
