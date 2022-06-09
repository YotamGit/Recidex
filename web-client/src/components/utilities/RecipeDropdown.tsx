//mui
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

//types
import { FC } from "react";

interface propTypes {
  value: string | undefined;
  items: string[];
  label_text: string;
  id_prefix: string;
  class_name: string;
  onChange: Function;
  resetField?: Function; //for resetting a field
}
const RecipeDropdown: FC<propTypes> = ({
  value,
  items,
  label_text,
  id_prefix,
  class_name,
  onChange,
  resetField,
}) => {
  return (
    <Box sx={{ minWidth: 120, margin: "5px" }}>
      <FormControl className={class_name} fullWidth>
        <InputLabel id="category-selector-label">{label_text}</InputLabel>
        <Select
          labelId={`${id_prefix}-selector-label`}
          id={`${id_prefix}-category-selector`}
          value={value ? value : ""}
          label={label_text}
          onChange={(e) => {
            onChange(e.target.value);
            resetField && resetField();
          }}
        >
          {items.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RecipeDropdown;
