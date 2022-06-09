import { useState } from "react";
import InputTextError from "./InputTextError";

//mui
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
//types
import { FC } from "react";
interface propTypes {
  type?: "text" | "password";
  inputId: string;
  labelText: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isValidFunc: Function;
  errorMessage: string;
}
const InputWithError: FC<propTypes> = ({
  type,
  inputId,
  labelText,
  value,
  setValue,
  isValidFunc,
  errorMessage,
}) => {
  const [invalidValue, setInvalidValue] = useState(false);
  return (
    <FormControl id={inputId}>
      <InputLabel htmlFor={inputId}>{labelText}</InputLabel>
      <OutlinedInput
        type={type ? type : "text"}
        value={value}
        onChange={async (e) => {
          setValue(e.target.value);
          setInvalidValue(!(await isValidFunc(e.target.value)));
        }}
        label={labelText}
      />
      <InputTextError showError={invalidValue} message={errorMessage} />
    </FormControl>
  );
};

export default InputWithError;
