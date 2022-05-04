import Button from "@mui/material/Button";

//redux
import { deleteUser } from "../../slices/usersSlice";
import { useAppDispatch } from "../../hooks";

//types
import { FC } from "react";

interface propTypes {
  userId: string;
}

const DeleteUserButton: FC<propTypes> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const onDeleteUser = async () => {
    let deleteChoice = window.confirm(`Delete User: ${userId}?`);
    if (deleteChoice) {
      await dispatch(deleteUser({ userId }));
    }
  };
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#fe4f4f" }}
      onClick={onDeleteUser}
    >
      Delete
    </Button>
  );
};

export default DeleteUserButton;
