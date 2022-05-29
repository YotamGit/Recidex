import "../../styles/recipe_editor/RecipeEditor.css";
import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import MarkdownEditSection from "../markdown/MarkdownEditSection";
import MarkdownPreviewSection from "../markdown/MarkdownPreviewSection";
import RecipeDropdown from "../RecipeDropdown";
import AuthorizedButton from "../Login/AuthorizedButton";
import { toBase64 } from "../../utils-module/images";
import TabPanel from "../TabPanel";
import GenericPromptDialog from "../GenericPromptDialog";

//mui
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

//redux
import { editRecipe, addRecipe } from "../../slices/recipesSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { Divider } from "@mui/material";

interface propTypes {
  action: "add" | "edit";
  recipe: TRecipe;
}
const RecipeEditor: FC<propTypes> = ({ action, recipe }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  //categories for inputs
  const recipe_categories = useAppSelector(
    (state) => state.filters.recipe_categories
  );
  const recipe_difficulties = useAppSelector(
    (state) => state.filters.recipe_difficulties
  );
  const recipe_durations = useAppSelector(
    (state) => state.filters.recipe_durations
  );

  //states for inputs
  const _id = recipe._id;
  const [privateRecipe, setPrivateRecipe] = useState(recipe.private);
  const [approval_required, setApprovalRequired] = useState(
    recipe.approval_required
  );
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
      dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to Upload Image.",
          details: error.response.data ? error.response.data : undefined,
        })
      );
    }
  };

  const deleteImage = () => {
    setImageName("");
    setImage(false);
  };

  const onSaveRecipeChanges = async () => {
    let recipeData: TRecipe = {
      private: privateRecipe,
      approval_required,
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

    switch (action) {
      case "edit":
        setDisableButtons(true);
        let editRes = await dispatch(
          editRecipe({ recipeData: recipeData, recipeId: _id })
        );
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
  };

  return (
    <div className="recipe-editor">
      <div className="metadata-section">
        <div style={{ marginTop: "30px" }}>Privacy</div>
        <Divider
          variant="middle"
          orientation="horizontal"
          style={{ width: "70%", backgroundColor: "gray" }}
        />
        <div className="recipe-privacy-section">
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={privateRecipe}
                  onChange={(e) => {
                    setPrivateRecipe(e.target.checked);
                    setApprovalRequired(false);
                  }}
                />
              }
              label="Private"
              labelPlacement="end"
            />
            <div className="privacy-explanation">
              Only the owner can see the recipe.
            </div>
            <div className="privacy-explanation">
              Private recipes can't be viewed using links or be favorited.
            </div>
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!privateRecipe}
                  onChange={(e) => setPrivateRecipe(!e.target.checked)}
                />
              }
              label="Public"
              labelPlacement="end"
            />
            <div className="privacy-explanation">
              Recipe is accessible through the owner's profile and links.
            </div>
          </div>
          <div style={{ paddingLeft: "31px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={approval_required}
                  disabled={privateRecipe}
                  onChange={(e) => setApprovalRequired(e.target.checked)}
                />
              }
              label="Request Approval"
              labelPlacement="end"
            />

            <div
              className="privacy-explanation"
              style={{ color: privateRecipe ? "rgba(0, 0, 0, 0.38)" : "" }}
            >
              Approved recipes appear on the main page and can be searched.
            </div>
          </div>
          <div
            className="privacy-explanation"
            style={{ marginTop: "10px", color: "red" }}
          >
            * Editing a recipe revokes its approved status.
          </div>
          <div className="privacy-explanation" style={{ color: "red" }}>
            Mark recipe for approval if you wish for it to be approved
          </div>
        </div>
        <Divider
          variant="middle"
          orientation="horizontal"
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            width: "70%",
            backgroundColor: "gray",
          }}
        />
        <div>
          English
          <Switch
            checked={rtl}
            onChange={(e) => setRtl(e.currentTarget.checked)}
            inputProps={{ "aria-label": "rtl-switch" }}
          />
          עברית
        </div>
        <div className="text-input-container">
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
        <div className="selectors-input-container">
          <RecipeDropdown
            value={category}
            items={Object.keys(recipe_categories)}
            label_text={"Category"}
            id_prefix={"editor-category"}
            class_name={"recipe-editor-form-control"}
            onChange={setCategory}
            resetField={() => setSubCategory("")} //empty string to remove previous value
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
        <div className="image-upload-container">
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
            <Button className="primary" variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {imageName && (
            <Chip
              className="image-name"
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
              className="image"
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
          onClick={() => setOpenConfirmDialog(true)}
        >
          <LoadingButton
            className="primary"
            style={{ margin: "5px" }}
            loading={disableButtons}
            variant="contained"
            disabled={disableButtons}
          >
            Submit
          </LoadingButton>
        </AuthorizedButton>
      </div>
      <GenericPromptDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        onConfirm={onSaveRecipeChanges}
        text={
          action === "add"
            ? `Upload new recipe - "${title}"?`
            : `Save changes to recipe - "${title}"?${
                recipe.approved
                  ? `\nThe recipe will need to be re-approved.`
                  : ""
              }`
        }
      />
    </div>
  );
};

export default RecipeEditor;
