import "../../styles/recipe_editor/RecipeEditor.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import RecipeEditorEditSection from "./RecipeEditorEditSection";
import RecipeDropdown from "../RecipeDropdown";
import AuthorizedButton from "../AuthorizedButton";

import SanitizeHtml from "sanitize-html";

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

const RecipeEditor = ({
  signedIn,
  setSignedIn,
  onEditRecipe,
  recipe,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
}) => {
  const navigate = useNavigate();

  const _id = recipe._id;
  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source);
  const [servings, setServings] = useState(recipe.servings);

  const [category, setCategory] = useState(recipe.category);
  const [sub_category, setSubCategory] = useState(recipe.sub_category);

  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [prep_time, setPrepTime] = useState(recipe.prep_time);
  const [total_time, setTotalTime] = useState(recipe.total_time);

  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [directions, setDirections] = useState(recipe.directions);
  const [rtl, setRtl] = useState(recipe.rtl);
  const [image, setImage] = useState(recipe.image);
  const [imageName, setImageName] = useState(recipe.imageName);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabs = (event, value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (activeTab === 1) {
      document.getElementById("recipe-editor-description").innerHTML =
        marked.parse(SanitizeHtml(description));
      document.getElementById("recipe-editor-ingredients").innerHTML =
        marked.parse(SanitizeHtml(ingredients));
      document.getElementById("recipe-editor-directions").innerHTML =
        marked.parse(SanitizeHtml(directions));
      if (image) {
        document.getElementById("recipe-editor-image").src = image;
      } else {
        document.getElementById("recipe-editor-image").src = "";
      }
    }
  }, [activeTab, description, ingredients, directions, image, imageName]);

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
          window.alert("Failed to Upload Image.\nReason: " + error.message);
        });
    }
  };

  const deleteImage = () => {
    setImageName("");
    setImage("");
  };

  const onSaveRecipeChanges = async () => {
    var save = window.confirm("Save?");
    if (save) {
      var result = await onEditRecipe({
        _id,
        title,
        category,
        sub_category,
        difficulty,
        prep_time,
        total_time,
        servings,
        description,
        ingredients,
        directions,
        rtl,
        source,
        imageName,
        image,
      });

      if (result) {
        navigate(-1);
      }
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
            sx={{
              minWidth: 120,
              margin: "5px",
              direction: rtl ? "rtl" : "ltr",
            }}
            id="outlined"
            label="Title"
            variant="standard"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
              direction: rtl ? "rtl" : "ltr",
            }}
            id="outlined"
            label="Source"
            variant="standard"
            defaultValue={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <TextField
            sx={{
              minWidth: 120,
              margin: "5px",
              direction: rtl ? "rtl" : "ltr",
            }}
            id="outlined"
            label="Servings"
            variant="standard"
            defaultValue={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>
        <div className="recipe-editor-selectors-input-container">
          <RecipeDropdown
            value={category}
            items={Object.keys(recipe_categories)}
            label_text={"Category"}
            id_prefix={"editor-category"}
            class_name={"recipe-editor-form-control"}
            onChange={setCategory}
          />
          <RecipeDropdown
            value={sub_category}
            items={
              recipe_categories[category] ? recipe_categories[category] : []
            }
            label_text={"Sub Category"}
            id_prefix={"editor-sub_category"}
            class_name={"recipe-editor-form-control"}
            onChange={setSubCategory}
          />
          <RecipeDropdown
            value={difficulty}
            items={recipe_difficulties}
            label_text={"Difficulty"}
            id_prefix={"editor-difficulty"}
            class_name={"recipe-editor-form-control"}
            onChange={setDifficulty}
          />
          <RecipeDropdown
            value={prep_time}
            items={recipe_durations}
            label_text={"Prep Time"}
            id_prefix={"editor-prep-time"}
            class_name={"recipe-editor-form-control"}
            onChange={setPrepTime}
          />
          <RecipeDropdown
            value={total_time}
            items={recipe_durations}
            label_text={"Total Time"}
            id_prefix={"editor-total-time"}
            class_name={"recipe-editor-form-control"}
            onChange={setTotalTime}
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
      <AuthorizedButton
        onClick={onSaveRecipeChanges}
        authorized={signedIn}
        setSignedIn={setSignedIn}
      >
        <SaveIcon
          style={{ width: "100%", backgroundColor: "rgb(97, 204, 70)" }}
        />
      </AuthorizedButton>
    </div>
  );
};

export default RecipeEditor;

function TabPanel(props) {
  const { children, value, index } = props;
  return <>{value === index && children}</>;
}
