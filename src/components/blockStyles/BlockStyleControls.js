import React from "react";
import StyleButton from "./StyleButton";

export const styleMap = {
  //for inline Code block
  CODE: {
    fontFamily: '"Andale Mono", "Menlo", "Consolas", monospace',
    fontSize: 14,
    padding: 2,
    color: "#ff595a",
  },
};

export function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";

    case "code-block":
      return "code-block"; //this adds code-block class
    default:
      return null;
  }
}

export const BLOCK_TYPES = [
  { label: " “ ” ", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "{ }", style: "code-block" },
];

export const BLOCK_TYPE_HEADINGS = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
];

function BlockStyleControls(props) {
  const { editorState, onToggle } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div>
      blockStyles-
      {BLOCK_TYPE_HEADINGS.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
}

export default BlockStyleControls;
