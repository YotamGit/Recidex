import { useState } from "react";
import GenericPromptDialog from "../utilities/GenericPromptDialog";

//mui
import LoadingButton from "@mui/lab/LoadingButton";

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
  const [disableButton, setDisableButton] = useState(false);

  const onDeleteUser = async () => {
    setDisableButton(true);
    await dispatch(deleteUser({ userId }));
    setDisableButton(false);
  };
  return (
    <>
      <LoadingButton
        loading={disableButton}
        variant="contained"
        style={{ backgroundColor: "rgb(255, 93, 85)" }}
        onClick={() => setOpenConfirmDialog(true)}
      >
        Delete
      </LoadingButton>
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
