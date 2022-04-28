import { useState } from "react";
import "../../styles/buttons/Share.css";

import { EmailShareButton } from "react-share";

//mui
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

//mui icons
import ShareIcon from "@mui/icons-material/Share";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
const Share = ({ url }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const copyUrl = () => {
    var copyText = document.getElementById("share-url-input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  };

  return (
    <>
      <Tooltip title="Share" arrow>
        <IconButton onClick={handleOpen}>
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <div className="share-modal">
          <EmailShareButton
            subject="recipe title"
            body="Hey! look at this recipe"
          >
            <EmailRoundedIcon style={{ color: "gray", fontSize: "30px" }} />
          </EmailShareButton>
          <div className="url-copy-section">
            <input id="share-url-input" type="text" value={url} readOnly />
            <Button variant="contained" onClick={copyUrl}>
              copy
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Share;
