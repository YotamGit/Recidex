import "../../styles/markdown/MarkdownEditSection.css";
import MarkdownToolbar from "./MarkdownToolbar";
//mui
import TextareaAutosize from "@mui/material/TextareaAutosize";

const MarkdownEditSection = ({ sectionTitle, setData, data, rtl }) => {
  return (
    <div
      className="markdown-edit-section"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <div className="markdown-edit-section-title">{sectionTitle}</div>
      <MarkdownToolbar
        textBoxId={`${sectionTitle}-markdown-text-box`}
        data={data}
        setData={setData}
      />
      <TextareaAutosize
        id={`${sectionTitle}-markdown-text-box`}
        className="markdown-text-box"
        placeholder={"Enter " + sectionTitle}
        onChange={(e) => setData(e.target.value)}
        value={data}
      />
    </div>
  );
};

export default MarkdownEditSection;
