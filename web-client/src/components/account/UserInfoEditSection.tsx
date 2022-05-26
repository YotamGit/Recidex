import { useEffect, useState } from "react";

import { validUsername, validEmail } from "../../utils-module/validation";
import GenericPromptDialog from "../GenericPromptDialog";

//redux
import { editUser } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

interface propTypes {
  userData: User;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfoEditSection: FC<propTypes> = ({ userData, setViewEdit }) => {
  const dispatch = useAppDispatch();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [username, setUsername] = useState(userData.username);
  const [firstname, setFirstname] = useState(userData.firstname);
  const [lastname, setLastname] = useState(userData.lastname);
  const [email, setEmail] = useState(userData.email);

  const validateInput = async () => {
    //check existance of required fields
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      username === ""
    ) {
      window.alert("Please fill all of the fields.");
      return false;
    }

    if (!validUsername(username || "")) {
      return false;
    }

    if (!(await validEmail(email || ""))) {
      return false;
    }
    return true;
  };

  const onEditUser = async () => {
    let isValidInputs = await validateInput();
    if (!isValidInputs) {
      return;
    }
    let editRes = await dispatch(
      editUser({
        action: "editSelf",
        userData: {
          _id: userData._id,
          role: userData.role,
          username,
          firstname,
          lastname,
          email,
        },
      })
    );
    if (editRes.meta.requestStatus === "fulfilled") {
      setViewEdit(false);
    }
  };

  return (
    <div className="user-info-edit-section">
      <div className="edit-container">
        <FormControl id="edit-user-username">
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
            }}
            label="Username"
            variant="standard"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="edit-user-firstname">
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
            }}
            label="First Name"
            variant="standard"
            defaultValue={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </FormControl>
        <FormControl id="edit-user-lastname">
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
            }}
            label="Last Name"
            variant="standard"
            defaultValue={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </FormControl>
        <FormControl id="edit-user-email">
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
            }}
            label="Email"
            variant="standard"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
      </div>
      <Button variant="contained" onClick={() => setViewEdit(false)}>
        Cancel
      </Button>
      <Button variant="contained" onClick={() => setOpenConfirmDialog(true)}>
        Save Changes
      </Button>
      <GenericPromptDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        onConfirm={onEditUser}
        title="Confirm Changes?"
        text={`Save changes made to account info?`}
      />
    </div>
  );
};

export default UserInfoEditSection;
