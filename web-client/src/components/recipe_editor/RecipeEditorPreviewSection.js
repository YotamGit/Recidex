//mui
import { Divider } from "@mui/material";

const RecipeEditorPreviewSection = ({ sectionTitle, innerHtml, rtl }) => {
  return (
    <div
      className="recipe-editor-section"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <div className="recipe-editor-section-title">{sectionTitle}</div>
      <Divider style={{ backgroundColor: "gray" }} variant="fullWidth" />
      <div
        className="recipe-editor-text-box"
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    </div>
  );
};

export default RecipeEditorPreviewSection;
