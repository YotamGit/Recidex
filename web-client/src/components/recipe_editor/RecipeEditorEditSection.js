import TextareaAutosize from "@mui/material/TextareaAutosize";

const RecipeEditorEditSection = ({ sectionTitle, setData, data, rtl }) => {
  return (
    <div
      className="recipe-editor-section"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <div className="recipe-editor-section-title">{sectionTitle}</div>
      <TextareaAutosize
        className="recipe-editor-text-box"
        placeholder={"Enter " + sectionTitle}
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
    </div>
  );
};

export default RecipeEditorEditSection;
