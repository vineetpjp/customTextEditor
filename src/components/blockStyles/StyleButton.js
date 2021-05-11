import React from "react";

function StyleButton(props) {
  const onToggle = () => {
    props.onToggle(props.style);
  };

  return (
    <button
      onClick={onToggle}
      style={{
        backgroundColor: props.active ? "red" : "transparent",
      }}
    >
      {props.label}
    </button>
  );
}

export default StyleButton;
