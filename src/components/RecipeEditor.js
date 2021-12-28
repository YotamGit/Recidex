import { useState, useEffect } from "react";
import "../styles/RecipeEditor.css";
import { marked } from "marked";
import RecipeEditorPreviewSection from "./RecipeEditorPreviewSection";
import { useNavigate } from "react-router-dom";

//mui
import SaveIcon from "@mui/icons-material/Save";
import Chip from "@mui/material/Chip";
import {
  Tabs,
  Tab,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Input,
  TextField,
  Switch,
  Box,
  Button,
} from "@mui/material/";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeEditor = ({ onEditRecipe, recipe }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source);

  const [category, setCategory] = useState(recipe.category);
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [duration, setDuration] = useState(recipe.duration);

  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [directions, setDirections] = useState(recipe.directions);
  const [rtl, setRtl] = useState(recipe.rtl);
  const [image, setImage] = useState(recipe.image);
  const id = recipe.id;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabs = (event, value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (activeTab === 1) {
      document.getElementById("recipe-editor-description").innerHTML =
        marked.parse(description);
      document.getElementById("recipe-editor-ingredients").innerHTML =
        marked.parse(ingredients);
      document.getElementById("recipe-editor-directions").innerHTML =
        marked.parse(directions);
      if (image) {
        document.getElementById("recipe-editor-image").src =
          window.URL.createObjectURL(image);
      } else {
        document.getElementById("recipe-editor-image").src = "";
      }
    }
  }, [activeTab, description, ingredients, directions, image]);

  const onSaveRecipeChanges = () => {
    var res = window.confirm("Save?");
    if (res) {
      res = onEditRecipe({
        id,
        title,
        category,
        difficulty,
        duration,
        description,
        ingredients,
        directions,
        rtl,
        source,
        image,
      });
      navigate(-1);
    }
  };

  const onUploadImage = (img) => {
    setImage(img);
    if (image) {
      document.getElementById("image-name").innerHTML = image.name;
    }
  };
  const deleteImage = () => {
    setImage("");
  };
  return (
    <div className="recipe-editor">
      <div className="recipe-editor-metadata-section">
        <div>
          ltr
          <Switch
            checked={rtl}
            onChange={(e) => setRtl(e.currentTarget.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
          rtl
        </div>
        <div className="recipe-editor-text-input-container">
          <TextField
            sx={{ minWidth: 120, margin: "5px" }}
            id="outlined"
            label="Title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            sx={{ minWidth: 120, margin: "5px" }}
            id="outlined"
            label="Source"
            defaultValue={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div className="recipe-editor-selectors-input-container">
          <Box sx={{ minWidth: 120, margin: "5px" }}>
            <FormControl className="recipe-editor-form-control" fullWidth>
              <InputLabel id="category-selector-label">Category</InputLabel>
              <Select
                labelId="category-selector-label"
                id="category-selector"
                value={category ? category : ""}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value={"Curry"}>Curry</MenuItem>
                <MenuItem value={"Meats"}>Meats</MenuItem>
                <MenuItem value={"Dairy"}>Dairy</MenuItem>
                <MenuItem value={"Pasta"}>Pasta</MenuItem>
                <MenuItem value={"Bread and doughs"}>Bread and doughs</MenuItem>
                <MenuItem value={"Pastries"}>Pastries</MenuItem>
                <MenuItem value={"Pizza"}>Pizza</MenuItem>
                <MenuItem value={"Desserts"}>Desserts</MenuItem>
                <MenuItem value={"Salad"}>Salad</MenuItem>
                <MenuItem value={"Soups and Stews"}>Soups and Stews</MenuItem>
                <MenuItem value={"Drinks"}>Drinks</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, margin: "5px" }}>
            <FormControl className="recipe-editor-form-control" fullWidth>
              <InputLabel id="difficulty-selector-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-selector-label"
                id="difficulty-selector"
                value={difficulty ? difficulty : ""}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value={"Very Easy"}>Very Easy</MenuItem>
                <MenuItem value={"Easy"}>Easy</MenuItem>
                <MenuItem value={"Medium"}>Medium</MenuItem>
                <MenuItem value={"Hard"}>Hard</MenuItem>
                <MenuItem value={"Very Hard"}>Very Hard</MenuItem>
                <MenuItem value={"Gordon Ramsay"}>Gordon Ramsay</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120, margin: "5px" }}>
            <FormControl className="recipe-editor-form-control" fullWidth>
              <InputLabel id="duration-selector-label">Duration</InputLabel>
              <Select
                labelId="duration-selector-label"
                id="duration-selector"
                value={duration ? duration : ""}
                label="Duration"
                onChange={(e) => setDuration(e.target.value)}
              >
                <MenuItem value={"under 10 minutes"}>under 10 minutes</MenuItem>
                <MenuItem value={"10-20 minutes"}>10-20 minutes</MenuItem>
                <MenuItem value={"20-40 minutes"}>20-40 minutes</MenuItem>
                <MenuItem value={"40-60 minutes"}>40-60 minutes</MenuItem>
                <MenuItem value={"1-2 hours"}>1-2 hours</MenuItem>
                <MenuItem value={"over 2 hours"}>over 2 hours</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="recipe-editor-image-upload-container">
          <label htmlFor="image-input">
            <input
              id="image-input"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => onUploadImage(e.target.files[0])}
              style={{ display: "none" }}
            />
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {image && (
            <Chip
              id="image-name"
              label={image.name}
              variant="outlined"
              onDelete={deleteImage}
              style={{ margin: "5px" }}
            />
          )}
        </div>
      </div>
      <Tabs
        centered
        className="recipe-editor-tabs"
        value={activeTab}
        onChange={handleTabs}
      >
        <Tab label="Edit"></Tab>
        <Tab label="Preview"></Tab>
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <div style={{ direction: rtl ? "rtl" : "ltr" }}>
          <RecipeEditorPreviewSection
            sectionTitle="Description"
            setData={setDescription}
            data={description}
            rtl={rtl}
          />
          <RecipeEditorPreviewSection
            sectionTitle="Ingredients"
            setData={setIngredients}
            data={ingredients}
            rtl={rtl}
          />
          <RecipeEditorPreviewSection
            sectionTitle="Directions"
            setData={setDirections}
            data={directions}
            rtl={rtl}
          />
        </div>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <div style={{ direction: rtl ? "rtl" : "ltr" }}>
          <h2>Description</h2>
          <div
            className="recipe-editor-text-box"
            id={"recipe-editor-description"}
          ></div>
          <h2>Ingredients</h2>
          <div
            className="recipe-editor-text-box"
            id={"recipe-editor-ingredients"}
          ></div>
          <h2>Directions</h2>
          <div
            className="recipe-editor-text-box"
            id={"recipe-editor-directions"}
          ></div>
          <img alt="" id="recipe-editor-image" />
        </div>
      </TabPanel>
      <Button
        onClick={onSaveRecipeChanges}
        variant="contained"
        color="success"
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </div>
  );
};

export default RecipeEditor;

function TabPanel(props) {
  const { children, value, index } = props;
  return <>{value === index && children}</>;
}
