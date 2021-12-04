import { marked } from "marked";
import { useState } from "react";
import "../styles/MarkdownEditor.css";

const MarkdownEditor = ({ submitText }) => {
  const [markdown, setMarkdown] = useState("");

  const markdownToHtml = (markdownText) => {
    setMarkdown(markdownText);
    document.getElementById("converted-markdown").innerHTML =
      marked.parse(markdownText);
    return;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!markdown) {
      alert("Please enter content");
      return;
    } else {
      var res = window.confirm("Save Recipe?");
      if (res) {
        markdownToHtml(markdown);
        //return data here to parent element
      }
    }
  };

  return (
    <form className="editor" onSubmit={onSubmit}>
      <div className="text-box-container">
        <div>
          <h3>Markdown</h3>
          <textarea
            className="editor-text-box"
            type="text"
            placeholder="Enter Markdown"
            onChange={(e) => markdownToHtml(e.target.value)}
          />
        </div>
        <div>
          <h3>Preview</h3>
          <div id="converted-markdown" className="editor-text-box">
            Preview
          </div>
        </div>
      </div>
      <input className="btn" type="submit" value={submitText} />
    </form>
  );
};

export default MarkdownEditor;
