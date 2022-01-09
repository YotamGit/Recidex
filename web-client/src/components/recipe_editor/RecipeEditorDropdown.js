import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const RecipeEditorDropdown = ({
  value,
  items,
  label_text,
  id_prefix,
  onChange,
}) => {
  return (
    <Box sx={{ minWidth: 120, margin: "5px" }}>
      <FormControl className="recipe-editor-form-control" fullWidth>
        <InputLabel id="category-selector-label">{label_text}</InputLabel>
        <Select
          labelId={`${id_prefix}-selector-label`}
          id={`${id_prefix}-category-selector`}
          value={value ? value : ""}
          label={label_text}
          onChange={(e) => onChange(e.target.value)}
        >
          {items.map((option) => (
            <MenuItem value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RecipeEditorDropdown;
