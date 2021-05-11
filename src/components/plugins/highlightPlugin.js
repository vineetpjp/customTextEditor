import { RichUtils } from "draft-js";

export default () => {
  return {
    customStyleMap: {
      HIGHLIGHT: {
        background: "#fffe0d",
      },
    },
    keyBindingFn: (e) => {
      if (e.ctrlKey && e.which === 72) {
        return "highlight";
      }
    },
    handleKeyCommand: (command, editorState, _, { setEditorState }) => {
      if (command === "highlight") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
        return true;
      }
    },
  };
};
