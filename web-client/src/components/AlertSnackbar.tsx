import { useEffect, useState } from "react";

//mui
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
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
  const message = useAppSelector((state) => state.utilities.alert.message);
  const details = useAppSelector((state) => state.utilities.alert.details);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(resetAlert());
  };

  return (
    <Snackbar
      key={message || "" + Date.now()}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={openAlert}
      // autoHideDuration={5000}
      onClose={handleClose}
      action={
        <>
          {" "}
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        severity="error"
        sx={{ width: "100%" }}
      >
        <span>{message}</span>
        {details && <Button variant="outlined">Details</Button>}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
