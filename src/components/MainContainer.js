import React, { useState, useRef } from "react";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RichUtils,
  CompositeDecorator,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";

import parse from "html-react-parser";
import draftToHtml from "draftjs-to-html";
import { stateToHTML } from "draft-js-export-html";

import InlineStyles from "./inlineStyles/InlineStyles";

import createHighlightPlugin from "./plugins/highlightPlugin";
import addLinkPlugin, { linkStrategy, Link } from "./plugins/addLinkPlugin";
import BlockStyleControls, {
  getBlockStyle,
  styleMap,
} from "./blockStyles/BlockStyleControls";

const plugins = [createHighlightPlugin(), addLinkPlugin];
const decorator = () =>
  new CompositeDecorator([
    {
      strategy: linkStrategy,
      component: Link,
    },
  ]);
function MainContainer() {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator())
  );

  const onChange = (editorState) => {
    // console.log(editorState);
    // const a = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // const b = EditorState.createWithContent(convertFromRaw(JSON.parse(a)));
    // console.log(a);
    // console.log(b);

    setEditorState(editorState);
  };

  const toggleInlineStyle = (style) => {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const onAddLink = () => {
    const selection = editorState.getSelection();
    const link = window.prompt("Paste the link -");
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();

    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );

    const entityKey = contentWithEntity.getLastCreatedEntityKey();

    onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  const isAddingOrUpdatingLink = () => {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    let url = "";
    if (linkKey != null) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
      const updatedLink = window.prompt("Update link-", url);
      const selection = editorState.getSelection();

      if (updatedLink == null) {
        return;
      } else if (url != updatedLink) {
        const contentWithEntity = contentState.replaceEntityData(linkKey, {
          url: updatedLink,
        });
        const newEditorState = EditorState.push(
          editorState,
          contentWithEntity,
          "create-entity"
        );
        onChange(
          RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            linkKey
          )
        );
      }
    } else {
      onAddLink();
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div>
      {/* <button onClick={onCodeClick}>code</button> */}
      <button onClick={isAddingOrUpdatingLink}>attach_file</button>
      <InlineStyles editorState={editorState} onToggle={toggleInlineStyle} />
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockType}
      />
      <div>
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          handleKeyCommand={handleKeyCommand}
          // blockRendererFn={onCodeClick}
        />
      </div>
      <hr />
      {draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      {parse(
        stateToHTML(editorState.getCurrentContent(), {
          inlineStyles: {
            HIGHLIGHT: {
              style: { backgroundColor: "yellow" },
            },
            CODE: {
              style: {
                fontFamily: '"Andale Mono", "Menlo", "Consolas", monospace',
                fontSize: 14,
                padding: 2,
                color: "#ff595a",
              },
            },
          },
          blockStyleFn: (block) => {
            switch (block.getType()) {
              case "blockquote":
                return {
                  attributes: { class: "RichEditor-blockquote" },
                };
              case "code-block":
                return { attributes: { class: "code-block" } }; //this adds code-block class
              default:
                return {};
            }
          },
          entityStyleFn: (entity) => {
            const entityType = entity.get("type").toLowerCase();
            if (entityType === "link") {
              const data = entity.getData();
              return {
                element: "a",
                attributes: {
                  href: data.url,
                },
                style: {
                  backgroundColor: "lightblue",
                },
              };
            }
          },
        })
      )}
    </div>
  );
}

export default MainContainer;
