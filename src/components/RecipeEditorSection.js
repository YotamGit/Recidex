import MarkdownEditor from "./MarkdownEditor";
import { useEffect } from "react";
import Popup from "reactjs-popup";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeEditorSection = ({ sectionTitle, setData, data, setRtl, rtl }) => {
  useEffect(() => {
    document.getElementById(
      "recipe-editor-" + sectionTitle.toLowerCase()
    ).innerHTML = marked.parse(data);
  }, [data, sectionTitle]);

  return (
    <div className="recipe-editor-section">
      <h2>{sectionTitle}</h2>
      <div
        className="recipe-editor-text-box"
        id={"recipe-editor-" + sectionTitle.toLowerCase()}
      ></div>
      <Popup
        className="recipe-editor-markdown-editor-popup"
        contentStyle={{ height: "100%", width: "100%" }}
        trigger={<button>Edit</button>}
        modal
        nested
      >
        {(close) => (
          <>
            <MarkdownEditor
              contextText={sectionTitle}
              setData={setData}
              setRtl={setRtl}
              close={close}
              defaultText={data}
              defaultRtl={rtl}
            />
          </>
        )}
      </Popup>
    </div>
  );
};

export default RecipeEditorSection;
