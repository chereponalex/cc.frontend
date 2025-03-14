import { NumericFormat, NumericFormatProps } from "react-number-format";
import { FieldInputProps } from "formik";
import Input from "@/components/ui/Input";
import { ComponentType } from "react";
const NumericFormatInput = ({
  onValueChange,
  ...rest
}: Omit<NumericFormatProps, "form"> & {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any;
  field: FieldInputProps<unknown>;
}) => {
  return (
    <NumericFormat
      customInput={Input as ComponentType}
      type="text"
      autoComplete="off"
      onValueChange={onValueChange}
      {...rest}
    />
  );
};

export default NumericFormatInput;
