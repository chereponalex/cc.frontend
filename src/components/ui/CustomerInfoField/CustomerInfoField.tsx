import CheckCircleSvg from "@/assets/svg/CheckCircleSvg";
import XCircleSvg from "@/assets/svg/XCircleSvg";
import { TypeField } from "@/@types";
import { ReactNode } from "react";

type CustomerInfoFieldProps = {
  title?: string;
  value?: string | number | boolean | any[] | ReactNode | null;
  type?: TypeField;
};

const CustomerInfoField = ({
  title,
  value,
  type = TypeField.DEFAULT,
}: CustomerInfoFieldProps) => {
  const render = () => {
    switch (type) {
      case TypeField.ICON:
        return (
          <div>
            {value ? (
              <CheckCircleSvg color="#22c55e" />
            ) : (
              <XCircleSvg color="#ef4444" />
            )}
          </div>
        );
      case TypeField.IMG:
        return <img src={value as string} alt="image" />;
      case TypeField.COLOR:
        return (
          <div
            style={{ background: value as string }}
            className="w-8 h-8 rounded-full border-solid border-2 border-gray-400"
          />
        );

      default:
        return (
          <p className="text-gray-700 dark:text-gray-200 font-semibold">
            {value}
          </p>
        );
    }
  };

  return (
    <div className="border-solid border-b last:border-b-0 border-gray-500 dark:border-gray-700 pb-1 last:pb-0">
      <span>{title}</span>
      {render()}
    </div>
  );
};

export default CustomerInfoField;
