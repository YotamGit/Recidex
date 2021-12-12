import { marked } from "marked";
import { useState, useEffect } from "react";
import "../styles/MarkdownEditor.css";

const MarkdownEditor = ({
  defaultText,
  defaultRtl,
  contextText,
  setData,
  close,
  setRtl,
}) => {
  const [markdown, setMarkdown] = useState(defaultText ? defaultText : "");
  const [rightToLeft, setRightToLeft] = useState(
    defaultRtl ? defaultRtl : false
  );

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
        setRtl(rightToLeft);
        close();
      }
    }
  };

  return (
    <form className="markdown-editor" onSubmit={onSubmit}>
      <h1 style={{ textAlign: "center" }}>{contextText}</h1>
      <div className="markdown-editor-text-box-container">
        <div>
          <h3>Markdown</h3>
          <textarea
            className="markdown-editor-text-box"
            type="text"
            placeholder="Enter Markdown"
            onChange={(e) => markdownToHtml(e.target.value)}
            value={markdown}
            style={{ direction: rightToLeft ? "rtl" : "ltr" }}
          />
        </div>
        <div>
          <h3>Preview</h3>
          <div
            id="converted-markdown"
            className="markdown-editor-text-box"
            style={{ direction: rightToLeft ? "rtl" : "ltr" }}
          >
            Preview
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <label>Set Right To left</label>
        <input
          type="checkbox"
          checked={rightToLeft}
          value={rightToLeft}
          onChange={(e) => setRightToLeft(e.currentTarget.checked)}
        />
      </div>
      <input className="btn" type="submit" value={"Save " + contextText} />
    </form>
  );
};

export default MarkdownEditor;
