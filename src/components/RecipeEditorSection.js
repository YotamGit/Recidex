import MarkdownEditor from "./MarkdownEditor";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { marked } from "marked";

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
      <Popup trigger={<button>Edit</button>} modal nested>
        {(close) => (
          <>
            <button onClick={close}>&times;</button>
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
