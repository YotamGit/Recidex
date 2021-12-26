import TextareaAutosize from "@mui/material/TextareaAutosize";
const RecipeEditorPreviewSection = ({ sectionTitle, setData, data, rtl }) => {
  return (
    <div className="recipe-editor-section">
      <h2>{sectionTitle}</h2>
      <TextareaAutosize
        className="recipe-editor-text-box"
        placeholder={"Enter " + sectionTitle}
        onChange={(e) => setData(e.target.value)}
        style={{ direction: rtl ? "rtl" : "ltr" }}
        value={data}
      />
    </div>
  );
};

export default RecipeEditorPreviewSection;
