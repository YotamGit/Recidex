import { marked } from "marked";
import { useState, useEffect } from "react";
import "../styles/MarkdownEditor.css";

const MarkdownEditor = ({ defaultText, submitText, setData, close }) => {
  const [markdown, setMarkdown] = useState(defaultText ? defaultText : "");
  console.log(markdown);
  useEffect(() => {
    if (defaultText) {
      document.getElementById("converted-markdown").innerHTML =
        marked.parse(markdown);
    }
  }, [markdown]);

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
      var res = window.confirm("Save?");
      if (res) {
        markdownToHtml(markdown);
        setData(markdown);
        close();
      }
    }
  };

  return (
    <form className="markdown-editor" onSubmit={onSubmit}>
      <div className="markdown-editor-text-box-container">
        <div>
          <h3>Markdown</h3>
          <textarea
            className="markdown-editor-text-box"
            type="text"
            placeholder="Enter Markdown"
            onChange={(e) => markdownToHtml(e.target.value)}
            value={markdown}
          />
        </div>
        <div>
          <h3>Preview</h3>
          <div id="converted-markdown" className="markdown-editor-text-box">
            Preview
          </div>
        </div>
      </div>
      <input className="btn" type="submit" value={submitText} />
    </form>
  );
};

export default MarkdownEditor;
