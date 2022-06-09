import { useState } from "react";
import GenericPromptDialog from "../utilities/GenericPromptDialog";

//mui
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const onDeleteUser = async () => {
    await dispatch(deleteUser({ userId }));
  };
  return (
    <>
      <Button
        variant="contained"
        style={{ backgroundColor: "rgb(255, 93, 85)" }}
        onClick={() => setOpenConfirmDialog(true)}
      >
        Delete
      </Button>
      <GenericPromptDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        onConfirm={onDeleteUser}
        title="Delete User?"
        text={`Delete user "${userId}"?`}
      />
    </>
  );
};

export default DeleteUserButton;
