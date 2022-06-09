import { useEffect, useState } from "react";
import InputTextError from "./InputTextError";

//mui
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

//mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//types
import { FC } from "react";
interface propTypes {
  type?: "text" | "password";
  inputId: string;
  labelText: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isValidFunc?: Function;
  errorMessage: string;
  showErrorOverride?: boolean;
}
const InputWithError: FC<propTypes> = ({
  type,
  inputId,
  labelText,
  value,
  setValue,
  isValidFunc,
  errorMessage,
  showErrorOverride,
}) => {
  const [invalidValue, setInvalidValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (showErrorOverride !== undefined) {
      setInvalidValue(showErrorOverride);
    }
  }, [showErrorOverride, value]);

  return (
    <FormControl id={inputId}>
      <InputLabel htmlFor={inputId}>{labelText}</InputLabel>
      <OutlinedInput
        type={
          type === "password" ? (showPassword ? "text" : "password") : "text"
        }
        value={value}
        onChange={async (e) => {
          setValue(e.target.value);
          //automatically set invalid only if no override
          if (showErrorOverride === undefined && isValidFunc) {
            setInvalidValue(!(await isValidFunc(e.target.value)));
          }
        }}
        label={labelText}
        endAdornment={
          type === "password" && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="start"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <InputTextError showError={invalidValue} message={errorMessage} />
    </FormControl>
  );
};

export default InputWithError;
