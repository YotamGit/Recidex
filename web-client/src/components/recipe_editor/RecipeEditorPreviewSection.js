const RecipeEditorPreviewSection = ({ sectionTitle, innerHtml, rtl }) => {
  return (
    <div
      className="recipe-editor-section"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <div className="recipe-editor-section-title">{sectionTitle}</div>
      <div
        className="recipe-editor-text-box"
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    </div>
  );
};

export default RecipeEditorPreviewSection;
