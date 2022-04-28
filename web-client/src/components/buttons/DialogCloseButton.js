import "../../styles/buttons/DialogCloseButton.css";

//mui
import IconButton from "@mui/material/IconButton";

//mui icons
import CloseIcon from "@mui/icons-material/Close";

const DialogCloseButton = ({ onClick }) => {
  return (
    <IconButton className="close-modal-icon" onClick={onClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default DialogCloseButton;
