//types
import { FC } from "react";
interface propTypes {
  showError: boolean;
  message: string;
}
const InputTextError: FC<propTypes> = ({ showError, message }) => {
  return showError ? (
    <div style={{ color: "red", fontSize: "0.8rem" }}>{message}</div>
  ) : (
    <></>
  );
};

export default InputTextError;
