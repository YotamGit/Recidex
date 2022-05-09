import { useEffect, useState } from "react";

//mui
import { Button } from "@mui/material";

//types
import { FC } from "react";
import { User } from "../../slices/usersSlice";

interface propTypes {
  userData: User;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserInfoEditSection: FC<propTypes> = ({ userData, setViewEdit }) => {
  const [username, setUsername] = useState(userData.username);
  const [firstname, setFirstname] = useState(userData.firstname);
  const [lastname, setLastname] = useState(userData.lastname);
  const [email, setEmail] = useState(userData.email);
  return (
    <div className="user-info-edit-section">
      <div className="edit-container"></div>
      <Button variant="contained" onClick={() => setViewEdit(false)}>
        Cancel
      </Button>
      <Button variant="contained">Save Changes</Button>
      {JSON.stringify(userData)}
    </div>
  );
};

export default UserInfoEditSection;
