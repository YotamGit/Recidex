import "../styles/AlertSnackbar.css";
import { useEffect, useState } from "react";

//mui
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import Button from "@mui/material/Button";
//mui icons
import CloseIcon from "@mui/icons-material/Close";

//types
import { FC } from "react";

//redux
import { useAppDispatch, useAppSelector } from "../hooks";
import { setAlert, resetAlert } from "../slices/utilitySlice";

const AlertSnackbar: FC = () => {
  const dispatch = useAppDispatch();
  const openAlert = useAppSelector((state) => state.utilities.alert.openAlert);
  const severity = useAppSelector((state) => state.utilities.alert.severity);
  const title = useAppSelector((state) => state.utilities.alert.title);
  const message = useAppSelector((state) => state.utilities.alert.message);
  const details = useAppSelector((state) => state.utilities.alert.details);

  const [showDetails, setShowDetails] = useState(false);
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(resetAlert());
    setShowDetails(false);
  };

  return (
    <Snackbar
      className="snackbar-alert"
      key={message || "" + Date.now()}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={openAlert}
      // autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert
        variant="filled"
        severity={severity}
        action={
          <div className="action">
            {details && (
              <Button
                className="details-button"
                variant="outlined"
                onClick={toggleShowDetails}
              >
                Details
              </Button>
            )}
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        <div className="message">{message}</div>
        {details && showDetails && (
          <>
            <div className="details">
              <AlertTitle>Details</AlertTitle>
              {details}
            </div>
          </>
        )}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
