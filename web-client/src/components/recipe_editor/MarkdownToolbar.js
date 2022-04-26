import "../../styles/recipe_editor/MarkdownToolbar.css";
//mui
import Tooltip from "@mui/material/Tooltip";

//mui icons
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";

const MarkdownToolbar = ({ textBoxId, data, setData }) => {
  const addText = (textToAdd, cursorOffset) => {
    const textarea = document.getElementById(textBoxId);

    const cursorPositionStart =
      document.getElementById(textBoxId).selectionStart;
    const cursorPositionEnd = document.getElementById(textBoxId).selectionEnd;

    const selectedText = textarea.value.slice(
      cursorPositionStart,
      cursorPositionEnd
    );

    //if text is selected while clicking an add button the selected text
    //and the textToAdd are combined using the offset
    var editedTextToAdd =
      textToAdd.slice(0, cursorOffset) +
      selectedText +
      textToAdd.slice(cursorOffset);

    const updatedData =
      data.slice(0, cursorPositionStart) +
      editedTextToAdd +
      data.slice(cursorPositionEnd);

    setData(updatedData);

    const newCursorPositionStart = cursorPositionStart + cursorOffset;
    //no idea why this works but it does
    //these positions should select the selected text if there was any
    const newCursorPositionEnd = cursorPositionEnd + cursorOffset;

    //value of the textarea is overwritten by the value in the state but
    //it is necessary to update it so we can move the cursor
    textarea.value = updatedData;
    textarea.focus();
    textarea.setSelectionRange(newCursorPositionStart, newCursorPositionEnd);
  };

  return (
    <div className="markdown-toolbar">
      <Tooltip title="Add heading text" arrow>
        <TitleRoundedIcon
          className="icon"
          onClick={() => addText("\n\n### ", "\n\n### ".length)}
        />
      </Tooltip>
      <Tooltip title="Add bold text" arrow>
        <FormatBoldRoundedIcon
          className="icon"
          onClick={() => addText("****", 2, 0, 0)}
        />
      </Tooltip>
      <Tooltip title="Add italic text" arrow>
        <FormatItalicRoundedIcon
          className="icon"
          onClick={() => addText(" __ ", 2, 0, 0)}
        />
      </Tooltip>
      <Tooltip title="Add checkbox" arrow>
        <CheckBoxOutlinedIcon
          className="icon"
          onClick={() => addText("\n- [ ] ", "\n- [ ] ".length)}
        />
      </Tooltip>
      <Tooltip title="Add a numbered list" arrow>
        <FormatListNumberedRoundedIcon
          className="icon"
          onClick={() => addText("\n1. ", "\n1. ".length)}
        />
      </Tooltip>
      <Tooltip title="Add a link" arrow>
        <InsertLinkRoundedIcon
          className="icon"
          onClick={() => addText("[](url)", 1)}
        />
      </Tooltip>
      <Tooltip title="Add a horizontal rule" arrow>
        <HorizontalRuleRoundedIcon
          className="icon"
          onClick={() => addText("\n\n---\n\n", "\n\n---\n\n".length)}
        />
      </Tooltip>
    </div>
  );
};

export default MarkdownToolbar;
