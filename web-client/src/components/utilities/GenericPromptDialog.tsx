import "../../styles/utilities/GenericPromptDialog.css";

import { useEffect, useRef } from "react";
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
  onCancel?: Function;
  title?: string;
  text?: string;
  content?: JSX.Element;
}
const GenericPromptDialog: FC<propTypes> = ({
  open,
  setOpen,
  onConfirm,
  onCancel,
  title,
  text,
  content,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  const handleCancel = () => {
    setOpen(false);
    onCancel && onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onConfirm();
      handleCancel();
    }
  };

  return (
    <Dialog
      className="generic-prompt-dialog"
      open={open}
      onClose={handleCancel}
      fullScreen={!fullscreen}
      onKeyPress={handleKeyPress}
    >
      <DialogCloseButton onClick={handleCancel} />
      <DialogTitle className="title">
        {title || "Confirmation Required"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: "pre-line" }}>
          {text || "Confirm?"}
        </DialogContentText>
        {content}
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
