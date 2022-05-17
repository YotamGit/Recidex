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
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { RootState } from "../../store";

interface propTypes {
  url: string;
  emailTitle: string;
}

const Share: FC<propTypes> = ({ url, emailTitle }) => {
  const fullscreen = useAppSelector(
    (state: RootState) => state.utilities.fullscreen
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const copyUrl = () => {
    let copyText = document.getElementById(
      "share-url-input"
    ) as HTMLInputElement;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <ShareIcon className="icon" />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullScreen={!fullscreen}>
        <DialogContent>
          <div className="share-modal">
            <DialogCloseButton onClick={handleClose} />
            <div className="share-modal-content">
              <EmailShareButton
                style={{ lineHeight: 0 }}
                subject={emailTitle}
                body={url}
                url={url}
              >
                <EmailRoundedIcon className="icon" />
              </EmailShareButton>
              <span style={{ marginBottom: "7px" }}>Or</span>
              <div className="url-copy-section">
                <input id="share-url-input" type="text" value={url} readOnly />
                <Button variant="contained" onClick={copyUrl}>
                  copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;
