import { useState } from "react";
import "../../styles/admin/EditUserButton.css";

import DialogCloseButton from "../buttons/DialogCloseButton";
import DeleteUserButton from "./DeleteUserButton";
import { validUsername, validEmail } from "../../utils-module/validation";

//mui
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

//redux
import { editUser } from "../../slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { FullUser } from "../../slices/usersSlice";

interface propTypes {
  user: FullUser;
}

const EditUserButton: FC<propTypes> = ({ user }) => {
  const dispatch = useAppDispatch();
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);
  const editorRole = useAppSelector((state) => state.users.userData.role);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [role, setRole] = useState(user.role);
  const [username, setUsername] = useState(user.username);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);

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

    if (!validUsername(username)) {
      return false;
    }

    if (!(await validEmail(email))) {
      return false;
    }
    return true;
  };

  const onEditUser = async () => {
    let editChoice = window.confirm("Save changes to user?");
    if (editChoice) {
      let isValidInputs = await validateInput();
      if (!isValidInputs) {
        return;
      }
      let editRes = await dispatch(
        editUser({
          action: "editOther",
          userData: {
            _id: user._id,
            role,
            username,
            firstname,
            lastname,
            email,
          },
        })
      );
      if (editRes.meta.requestStatus === "fulfilled") {
        handleClose();
      }
    }
  };
  return (
    <>
      <Button
        variant="contained"
        style={{ margin: "5px" }}
        onClick={handleOpen}
      >
        Edit
      </Button>

      <Dialog open={open} onClose={handleClose} fullScreen={!fullscreen}>
        <DialogContent>
          <div className="edit-user-modal">
            <DialogCloseButton onClick={handleClose} />
            <div className="edit-user-id">_id: {user._id}</div>
            <div className="edit-user-inputs">
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
              {editorRole === "admin" && (
                <FormControl id="edit-user-role">
                  <InputLabel id="role-selector-label">
                    {"User Role"}
                  </InputLabel>
                  <Select
                    labelId={`role-selector-label`}
                    value={role}
                    label={"User Role"}
                    variant="standard"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {["admin", "moderator", "member"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
            <div className="edit-user-buttons">
              <DeleteUserButton userId={user._id} />
              <Button variant="contained" onClick={onEditUser}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUserButton;
