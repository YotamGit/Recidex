import { useState } from "react";
import "../../styles/buttons/Share.css";
import DialogCloseButton from "./DialogCloseButton";

import { EmailShareButton } from "react-share";

//mui
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

//mui icons
import ShareIcon from "@mui/icons-material/Share";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

//redux
import { useSelector } from "react-redux";

const Share = ({ url, emailTitle, size }) => {
  const fullscreen = useSelector((state) => state.utilities.fullscreen);

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
      <IconButton onClick={handleOpen}>
        <ShareIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullScreen={!fullscreen}>
        <DialogContent>
          <div className="share-modal">
            <DialogCloseButton onClick={handleClose} />
            <EmailShareButton subject={emailTitle} body={url}>
              <EmailRoundedIcon style={{ color: "gray", fontSize: "30px" }} />
            </EmailShareButton>
            <span style={{ marginBottom: "10px" }}>Or</span>
            <div className="url-copy-section">
              <input id="share-url-input" type="text" value={url} readOnly />
              <Button variant="contained" onClick={copyUrl}>
                copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;
