import "../../styles/buttons/DialogCloseButton.css";

//mui
import IconButton from "@mui/material/IconButton";

//mui icons
import CloseIcon from "@mui/icons-material/Close";

//types
import { FC, MouseEventHandler } from "react";

interface propTypes {
  onClick:MouseEventHandler
}
const DialogCloseButton:FC<propTypes> = ({ onClick })=> {
  return (
    <IconButton className="close-modal-icon" onClick={onClick}>
      <CloseIcon />
    </IconButton>
  ); 
};

export default DialogCloseButton;
