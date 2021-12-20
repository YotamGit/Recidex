import { marked } from "marked";
import { useState, useEffect } from "react";
import "../styles/MarkdownEditor.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

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

  const [activeTab, setActiveTab] = useState(0);
  const handleTabs = (event, value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (defaultText) {
      if (activeTab === 1) {
        document.getElementById("converted-markdown").innerHTML =
          marked.parse(markdown);
      }
    }
  }, [activeTab, markdown, defaultText]);

  const markdownToHtml = (markdownText) => {
    setMarkdown(markdownText);
    if (activeTab === 1) {
      document.getElementById("converted-markdown").innerHTML =
        marked.parse(markdownText);
    }
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
        <Tabs value={activeTab} onChange={handleTabs}>
          <Tab label="Markdown"></Tab>
          <Tab label="Preview"></Tab>
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <textarea
            className="markdown-editor-text-box"
            type="text"
            placeholder="Enter Markdown"
            onChange={(e) => markdownToHtml(e.target.value)}
            value={markdown}
            style={{ direction: rightToLeft ? "rtl" : "ltr" }}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <div
            id="converted-markdown"
            className="markdown-editor-text-box"
            style={{ direction: rightToLeft ? "rtl" : "ltr" }}
          >
            Preview
          </div>
        </TabPanel>
        <div style={{ textAlign: "center" }}>
          <label>Set Right To left</label>
          <input
            type="checkbox"
            checked={rightToLeft}
            value={rightToLeft}
            onChange={(e) => setRightToLeft(e.currentTarget.checked)}
          />
        </div>
        <div className="markdown-editor-button-row">
          <input className="markdown-btn" type="submit" value={"Save Edit"} />
          <button className="markdown-btn" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </form>
  );
};

export default MarkdownEditor;

function TabPanel(props) {
  const { children, value, index } = props;
  return <>{value === index && children}</>;
}
