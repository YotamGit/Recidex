import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "../styles/RecipeEditor.css";
import { marked } from "marked";
import RecipeEditorSection from "./RecipeEditorSection";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
    }
  }, [activeTab, description, ingredients, directions]);

  const onSaveRecipeChanges = () => {
    var res = window.confirm("Save?");
    if (res) {
      onEditRecipe({
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
      });
      navigate(-1);
    }
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
            id="outlined"
            label="Title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="outlined"
            label="Source"
            defaultValue={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div className="recipe-editor-selectors-input-container">
          <FormControl margin="normal" fullWidth>
            <InputLabel id="category-selector-label">Category</InputLabel>
            <Select
              labelId="category-selector-label"
              id="category-selector"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value={"Desserts"}>Desserts</MenuItem>
              <MenuItem value={"Pastries"}>Pastries</MenuItem>
              <MenuItem value={"Soups"}>Soups</MenuItem>
              <MenuItem value={"Snacks"}>Snacks</MenuItem>
            </Select>
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="difficulty-selector-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-selector-label"
              id="difficulty-selector"
              value={difficulty}
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
          <FormControl margin="normal" fullWidth>
            <InputLabel id="duration-selector-label">Duration</InputLabel>
            <Select
              labelId="duration-selector-label"
              id="duration-selector"
              value={duration}
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
        </div>
      </div>
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
          id={"recipe-editor-direction"}
        ></div>
        {/* <RecipeEditorSection
          sectionTitle={"Description"}
          setData={setDescription}
          data={description}
          setRtl={setRtl}
          rtl={rtl}
        />
        <RecipeEditorSection
          sectionTitle={"Ingredients"}
          setData={setIngredients}
          data={ingredients}
          setRtl={setRtl}
          rtl={rtl}
        />
        <RecipeEditorSection
          sectionTitle={"Directions"}
          setData={setDirections}
          data={directions}
          setRtl={setRtl}
          rtl={rtl}
        /> */}
      </div>
      <button onClick={onSaveRecipeChanges}>Save Changes</button>
    </div>
  );
};

export default RecipeEditor;
