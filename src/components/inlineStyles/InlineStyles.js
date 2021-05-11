import React from "react";
import StyleButton from "../blockStyles/StyleButton";

export const INLINE_HEADINGS = [
  { label: "U", style: "UNDERLINE" },
  { label: "I", style: "ITALIC" },
  { label: "B", style: "BOLD" },
  { label: "</>", style: "CODE" },
  { label: "H", style: "HIGHLIGHT" },
];

function InlineStyles(props) {
  const { editorState, onToggle } = props;
  const currentInlineStyle = editorState.getCurrentInlineStyle();

  return (
    <div>
      inlineStyles-
      {INLINE_HEADINGS.map((type) => (
        <StyleButton
          key={type.label}
          active={currentInlineStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          className="inline styleButton"
          id={type.style.toLowerCase()}
        />
      ))}
    </div>
  );
}

export default InlineStyles;
