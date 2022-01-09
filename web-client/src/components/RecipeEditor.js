import "../styles/RecipeEditor.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import RecipeEditorEditSection from "./RecipeEditorEditSection";
import RecipeEditorDropdown from "./RecipeEditorDropdown";

//mui
import SaveIcon from "@mui/icons-material/Save";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeEditor = ({ onEditRecipe, recipe }) => {
  const navigate = useNavigate();
  const recipe_main_categories = {
    Proteins: ["Meat", "Chicken", "Fish", "Other"],
    Salads: [],
    Asian: ["Japanese", "Chinese", "Thai", "Indian", "Other"],
    "Soups and Stews": ["Clear Soup", "Thick Soup", "Stew", "Other"],
    Pasta: [],
    "Pizza and Focaccia": [],
    Bread: ["Salty Pastries", "Other"],
    Drinks: ["Hot", "Cold", "Alcohol", "Other"],
    Desserts: [
      "Cookies",
      "Yeast",
      "Cakes",
      "Tarts and Pies",
      "Cup",
      "Snacks and Candies",
    ],
    Other: [],
  };
  const recipe_difficulties = [
    "Very Easy",
    "Easy",
    "Medium",
    "Hard",
    "Very Hard",
    "Gordon Ramsay",
  ];
  const recipe_durations = [
    "under 10 minutes",
    "10-20 minutes",
    "20-40 minutes",
    "40-60 minutes",
    "1-2 hours",
    "over 2 hours",
  ];
  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source);

  const [category, setCategory] = useState(recipe.category);
  const [sub_category, setSubCategory] = useState(recipe.sub_category);
  const [recipe_sub_categories, setRecipeSubCategories] = useState(
    recipe_main_categories[category] ? recipe_main_categories[category] : []
  ); // used to for the sub category dropdown selector

  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [duration, setDuration] = useState(recipe.duration);

  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [directions, setDirections] = useState(recipe.directions);
  const [rtl, setRtl] = useState(recipe.rtl);
  const [image, setImage] = useState(recipe.image);
  const [imageName, setImageName] = useState(recipe.imageName);
  const _id = recipe._id;

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
        document.getElementById("recipe-editor-image").src = image;
      } else {
        document.getElementById("recipe-editor-image").src = "";
      }
    }
  }, [activeTab, description, ingredients, directions, image, imageName]);

  const onSelectCategory = (value) => {
    setCategory(value);
    setRecipeSubCategories(recipe_main_categories[value]);
  };

  // Image to base64 converter for image uplaod
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onUploadImage = (img) => {
    if (img.size >= 10485760) {
      window.alert(
        `ERROR UPLOADING IMAGE\n\nImage is too large. \nMaximum image size: 10Mb\nUploaded image size is: ${
          Math.round((img.size / 1024 / 1024 + Number.EPSILON) * 100) / 100
        } Mb`
      );
      return;
    } else {
      toBase64(img)
        .then((result) => {
          setImageName(img.name);
          setImage(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteImage = () => {
    setImageName("");
    setImage("");
  };

  const onSaveRecipeChanges = async () => {
    var res = window.confirm("Save?");
    if (res) {
      await onEditRecipe({
        _id,
        title,
        category,
        sub_category,
        difficulty,
        duration,
        description,
        ingredients,
        directions,
        rtl,
        source,
        imageName,
        image,
      })
        .then((result) => {
          navigate(-1);
        })
        .catch((error) => {
          window.alert(error);
          return;
        });
    }
  };

  return (
    <div className="recipe-editor">
      <div className="recipe-editor-metadata-section">
        <div>
          English
          <Switch
            checked={rtl}
            onChange={(e) => setRtl(e.currentTarget.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
          עברית
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
          <RecipeEditorDropdown
            value={category}
            items={Object.keys(recipe_main_categories)}
            label_text={"Category"}
            id_prefix={"category"}
            onChange={onSelectCategory}
          />
          <RecipeEditorDropdown
            value={sub_category}
            items={recipe_sub_categories}
            label_text={"Sub Category"}
            id_prefix={"sub_category"}
            onChange={setSubCategory}
          />
          <RecipeEditorDropdown
            value={difficulty}
            items={recipe_difficulties}
            label_text={"Difficulty"}
            id_prefix={"difficulty"}
            onChange={setDifficulty}
          />
          <RecipeEditorDropdown
            value={duration}
            items={recipe_durations}
            label_text={"Duretion"}
            id_prefix={"duration"}
            onChange={setDuration}
          />
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
              label={imageName}
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
          <RecipeEditorEditSection
            sectionTitle={rtl ? "תיאור" : "Description"}
            setData={setDescription}
            data={description}
            rtl={rtl}
          />
          <RecipeEditorEditSection
            sectionTitle={rtl ? "מרכיבים" : "Ingredients"}
            setData={setIngredients}
            data={ingredients}
            rtl={rtl}
          />
          <RecipeEditorEditSection
            sectionTitle={rtl ? "הוראות" : "Directions"}
            setData={setDirections}
            data={directions}
            rtl={rtl}
          />
        </div>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <div style={{ direction: rtl ? "rtl" : "ltr" }}>
          <h2>{rtl ? "תיאור" : "Description"}</h2>
          <div
            className="recipe-editor-text-box"
            id={"recipe-editor-description"}
          ></div>
          <h2>{rtl ? "מרכיבים" : "Ingredients"}</h2>
          <div
            className="recipe-editor-text-box"
            id={"recipe-editor-ingredients"}
          ></div>
          <h2>{rtl ? "הוראות" : "Directions"}</h2>
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
