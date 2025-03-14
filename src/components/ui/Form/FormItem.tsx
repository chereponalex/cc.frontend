import { forwardRef } from "react";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "./context";
import { useConfig } from "../ConfigProvider";
import { CONTROL_SIZES, LAYOUT } from "../utils/constants";
import type { CommonProps, TypeAttributes } from "../@types/common";
import type { ReactNode } from "react";

export interface FormItemProps extends CommonProps {
  asterisk?: boolean;
  errorMessage?: string;
  extra?: string | ReactNode;
  htmlFor?: string;
  invalid?: boolean | "";
  label?: string;
  labelClass?: string;
  labelWidth?: string | number;
  layout?: TypeAttributes.FormLayout;
  size?: TypeAttributes.ControlSize;
  noPadding?: boolean;
  bottom?: number;
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
  const {
    asterisk,
    children,
    className,
    errorMessage,
    extra,
    htmlFor,
    invalid,
    label,
    labelClass,
    labelWidth,
    layout,
    style,
    size,
    noPadding,
    bottom,
  } = props;

  const formContext = useForm();
  const { controlSize } = useConfig();

  const formItemLabelHeight = size || formContext?.size || controlSize;
  const formItemLabelWidth = labelWidth || formContext?.labelWidth;
  const formItemLayout = layout || formContext?.layout;

  const getFormLabelLayoutClass = () => {
    switch (formItemLayout) {
      case LAYOUT.HORIZONTAL:
        return label
          ? `h-${CONTROL_SIZES[formItemLabelHeight]} ${
              label && "ltr:pr-2 rtl:pl-2"
            }`
          : "ltr:pr-2 rtl:pl-2";
      case LAYOUT.VERTICAL:
        return `mb-2`;
      case LAYOUT.INLINE:
        return `h-${CONTROL_SIZES[formItemLabelHeight]} ${
          label && "ltr:pr-2 rtl:pl-2"
        }`;
      default:
        break;
    }
  };

  const formItemClass = classNames(
    "form-item",
    `border-solid last:border-b-0 border-gray-500 dark:border-gray-700 last:pb-1 justify-between`,
    noPadding ? "pb-1" : "pb-5",
    formItemLayout,
    className,
    invalid ? "invalid" : "",
  );

  const formLabelClass = classNames(
    "form-label",
    label && getFormLabelLayoutClass(),
    labelClass,
  );

  const formLabelStyle = () => {
    if (formItemLayout === LAYOUT.HORIZONTAL) {
      return { ...style, ...{ minWidth: formItemLabelWidth } };
    }

    return { ...style };
  };

  const enterStyle = {
    opacity: 1,
    marginTop: 3,
    bottom: bottom ? bottom : -15,
  };
  const exitStyle = { opacity: 0, marginTop: -10 };
  const initialStyle = exitStyle;

  return (
    <div ref={ref} className={formItemClass}>
      <label
        htmlFor={htmlFor}
        className={formLabelClass}
        style={formLabelStyle()}
      >
        {extra && <span>{extra}</span>}
        {label}
        {asterisk && <span className="text-red-500 rtr:ml-1 ltl:mr-1">*</span>}
        {label && formItemLayout !== "vertical" && ":"}
      </label>
      <div
        className={
          formItemLayout === LAYOUT.HORIZONTAL
            ? "w-3/4 min-w-48 flex flex-col justify-center relative"
            : ""
        }
      >
        {children}
        <AnimatePresence mode="wait">
          {invalid && (
            <motion.div
              className="form-explain"
              initial={initialStyle}
              animate={enterStyle}
              exit={exitStyle}
              transition={{ duration: 0.15, type: "tween" }}
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

FormItem.displayName = "FormItem";

export default FormItem;
