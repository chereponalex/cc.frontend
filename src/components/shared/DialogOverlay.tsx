import React from "react";

type DialogOverlayTypes = {
  children: React.ReactChild | React.ReactChild[];
  onClick?: () => void;
  className?: string;
  id?: string | number;
};

export const DialogOverlay = (props: DialogOverlayTypes) => {
  return (
    // <div className={`dialog-overlay`} onClick={props.onClick}>
    // <div className="dialog-overlay_container">{props.children}</div>
    // </div>
    <div>{props.children}</div>
  );
};
