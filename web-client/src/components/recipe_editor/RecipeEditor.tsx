import "../../styles/recipe_editor/RecipeEditor.css";
import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import MarkdownEditSection from "../markdown/MarkdownEditSection";
import MarkdownPreviewSection from "../markdown/MarkdownPreviewSection";
import RecipeDropdown from "../RecipeDropdown";
import AuthorizedButton from "../Login/AuthorizedButton";
import { toBase64 } from "../../utils-module/images";

//mui
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//redux
import { editRecipe, addRecipe } from "../../slices/recipesSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";

//types
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  action: "add" | "edit";
  recipe: TRecipe;
}
const RecipeEditor: FC<propTypes> = ({ action, recipe }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const recipe_categories = useAppSelector(
    (state) => state.filters.recipe_categories
  );
  const recipe_difficulties = useAppSelector(
    (state) => state.filters.recipe_difficulties
  );
  const recipe_durations = useAppSelector(
    (state) => state.filters.recipe_durations
  );

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
  const [imageName, setImageName] = useState(recipe.imageName);

  //string:uploading a new photo
  //boolean(false):deleting a photo
  //undefined:no changes to photo
  const [image, setImage] = useState<string | boolean | undefined>(undefined);

  const [activeTab, setActiveTab] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);

  const handleTabs = (event: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
  };

  //prompt user before leaving/closing/refreshing the page
  //does not prevent go back to previous page event
  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const onUploadImage = async (img: File | undefined) => {
    try {
      if (img) {
        toBase64(img).then((result: string) => {
          setImageName(img.name);
          setImage(result);
        });
      }
    } catch (error: any) {
      window.alert("Failed to Upload Image.\nReason: " + error.message);
    }
  };

  const deleteImage = () => {
    setImageName("");
    setImage(false);
  };

  const onSaveRecipeChanges = async () => {
    let save = window.confirm("Save?");
    let recipeData: TRecipe = {
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
    };

    if (save) {
      switch (action) {
        case "edit":
          setDisableButtons(true);
          let editRes = await dispatch(editRecipe({ recipeData: recipeData }));
          setDisableButtons(false);

          if (editRes.meta.requestStatus === "fulfilled") {
            navigate(-1);
          }

          break;
        case "add":
          delete recipeData._id;
          setDisableButtons(true);
          let addRes = await dispatch(addRecipe({ recipeData: recipeData }));
          setDisableButtons(false);

          if (addRes.meta.requestStatus === "fulfilled") {
            navigate("/home");
          }
          break;
        default:
          throw new Error("Unknown Action");
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
              onChange={(e) =>
                onUploadImage(
                  e.target.files instanceof FileList
                    ? e.target.files[0]
                    : undefined
                )
              }
              style={{ display: "none" }}
            />
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {imageName && (
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
        <div>
          <MarkdownEditSection
            sectionTitle={rtl ? "תיאור" : "Description"}
            setData={setDescription}
            data={description}
            rtl={rtl}
          />
          <MarkdownEditSection
            sectionTitle={rtl ? "מרכיבים" : "Ingredients"}
            setData={setIngredients}
            data={ingredients}
            rtl={rtl}
          />
          <MarkdownEditSection
            sectionTitle={rtl ? "הוראות" : "Directions"}
            setData={setDirections}
            data={directions}
            rtl={rtl}
          />
        </div>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <div>
          <MarkdownPreviewSection
            sectionTitle={rtl ? "תיאור" : "Description"}
            markdownText={description}
            rtl={rtl}
          />
          <MarkdownPreviewSection
            sectionTitle={rtl ? "מרכיבים" : "Ingredients"}
            markdownText={ingredients}
            rtl={rtl}
          />
          <MarkdownPreviewSection
            sectionTitle={rtl ? "הוראות" : "Directions"}
            markdownText={directions}
            rtl={rtl}
          />
          {imageName && (
            <img
              className="recipe-editor-image"
              alt=""
              src={
                (image as string) ||
                `/api/recipes/image/${recipe._id}?${Date.now()}`
              }
            />
          )}
        </div>
      </TabPanel>
      <div style={{ textAlign: "center" }}>
        <AuthorizedButton
          type={"button"}
          disabled={disableButtons}
          onClick={onSaveRecipeChanges}
        >
          <LoadingButton
            style={{ margin: "5px" }}
            loading={disableButtons}
            variant="contained"
            disabled={disableButtons}
          >
            Submit
          </LoadingButton>
        </AuthorizedButton>
      </div>
    </div>
  );
};

export default RecipeEditor;

interface tabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: tabPanelProps) {
  const { children, value, index } = props;
  return <>{value === index && children}</>;
}
