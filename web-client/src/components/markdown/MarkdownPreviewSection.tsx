import "../../styles/markdown/MarkdownPreviewSection.css";

import { marked } from "marked";
import SanitizeHtml from "sanitize-html";

//mui
import { Divider } from "@mui/material";

//types
import { FC } from "react";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

interface propTypes {
  sectionTitle: string;
  markdownText: string;
  rtl: boolean;
}
const MarkdownPreviewSection: FC<propTypes> = ({
  sectionTitle,
  markdownText,
  rtl,
}) => {
  return (
    <div
      className="markdown-preview-section"
      style={{ direction: rtl ? "rtl" : "ltr" }}
    >
      <div className="markdown-preview-section-title">{sectionTitle}</div>
      <Divider style={{ backgroundColor: "gray" }} variant="fullWidth" />
      <div
        className="markdown-box"
        dangerouslySetInnerHTML={{
          __html: marked.parse(SanitizeHtml(markdownText)),
        }}
      />
    </div>
  );
};

export default MarkdownPreviewSection;
