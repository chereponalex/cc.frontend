import React, { useEffect } from "react";
import { DialogOverlay } from "./DialogOverlay";
import useDarkMode from "@/utils/hooks/useDarkmode";

type DialogProps = {
  children: React.ReactChild | React.ReactChild[];
  value: boolean;
  onChange?: (
    val: boolean,
  ) => any | React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  notClosable?: boolean;
  id?: string | number;
  fullscreenOnMobile?: boolean;
  isDark: boolean;
};

export const Dialog: React.FC<DialogProps> = ({
  children,
  fullscreenOnMobile,
  onChange,
  notClosable,
  value,
  id,
  isDark,
}) => {
  const close = () => {
    onChange && onChange(false);
  };

  const documentKeypressHandler = (e: KeyboardEvent) => {
    if (e.keyCode === 27 && !notClosable) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", documentKeypressHandler);
    return () =>
      document.removeEventListener("keydown", documentKeypressHandler);
  }, []);

  return (
    <>
      {value && (
        <DialogOverlay id={id} onClick={close}>
          <div
            style={{ background: isDark ? "#374151" : "#ffffff" }}
            className="styled-dialog"
            onClick={(e: any) => e.stopPropagation()}
            data-fullscreen-on-modile={fullscreenOnMobile}
          >
            {children}
          </div>
        </DialogOverlay>
      )}
    </>
  );
};
