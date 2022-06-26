import "../../styles/recipe_moderation/DisapproveReasonDialog.css";
import DialogCloseButton from "../buttons/DialogCloseButton";
import { useEffect } from "react";

//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//redux
import { useAppSelector } from "../../hooks";
//types
import { FC } from "react";
interface propTypes {
  open: boolean;
  setOpen: Function;
  setReason: Function;
  onSubmit: Function;
}
const DisapproveReasonDialog: FC<propTypes> = ({
  open,
  setOpen,
  setReason,
  onSubmit,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  const handleCancel = () => {
    setOpen(false);
    setReason();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === "Enter") {
      onSubmit();
      handleCancel();
    }
  };

  return (
    <Dialog
      className="disapprove-reason-dialog"
      open={open}
      onClose={handleCancel}
      fullScreen={!fullscreen}
      onKeyPress={handleKeyPress}
    >
      <DialogCloseButton onClick={handleCancel} />
      <DialogTitle className="disapprove-dialog-title">
        Disapprove Recipe
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          State reason for disapproving the recipe and what changes are needed.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          label="Reason"
          variant="standard"
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          className="disapprove-cancel-button secondary"
          variant="contained"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="primary"
          variant="contained"
          onClick={() => {
            onSubmit();
            handleCancel();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisapproveReasonDialog;
