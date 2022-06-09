import "../../styles/utilities/GenericPromptDialog.css";

import DialogCloseButton from "../buttons/DialogCloseButton";

//mui
import Button from "@mui/material/Button";
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
  onConfirm: Function;
  title?: string;
  text?: string;
}
const GenericPromptDialog: FC<propTypes> = ({
  open,
  setOpen,
  onConfirm,
  title,
  text,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Dialog
      className="generic-prompt-dialog"
      open={open}
      onClose={handleCancel}
      fullScreen={!fullscreen}
    >
      <DialogCloseButton onClick={handleCancel} />
      <DialogTitle className="title">
        {title || "Confirmation Required"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: "pre-line" }}>
          {text || "Confirm?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          className="cancel-button secondary"
          variant="contained"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="primary"
          variant="contained"
          onClick={() => {
            onConfirm();
            handleCancel();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericPromptDialog;
