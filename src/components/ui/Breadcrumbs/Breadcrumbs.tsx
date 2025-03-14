import { CommonProps, TypeAttributes } from "@/components/ui/@types/common";
import { forwardRef } from "react";
import { useConfig } from "@/components/ui/ConfigProvider";
import { useForm } from "@/components/ui/Form/context";
import { useInputGroup } from "@/components/ui/InputGroup/context";
import { CONTROL_SIZES, SIZES } from "@/components/ui/utils/constants";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cutString from "@/utils/cutString";

export interface BreadcrumbsProps extends CommonProps {
  location?: Location;
  color?: string;
  shape?: TypeAttributes.Shape;
  size?: TypeAttributes.Size;
  variant?: "solid" | "twoTone" | "plain" | "default";
  idName?: string;
}

type BreadcrumbsColor = {
  textColor: string;
};

const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(
  (props, ref) => {
    const {
      location,
      className,
      color = "",
      shape = "round",
      size,
      variant = "default",
      idName,
      ...rest
    } = props;

    const { t } = useTranslation();

    const routLocation = location ? location : useLocation();

    const { themeColor, controlSize, primaryColorLevel } = useConfig();
    const formControlSize = useForm()?.size;
    const inputGroupSize = useInputGroup()?.size;
    const defaultClass = "breadcrumbs";
    const splitedColor = color?.split("-") || [];

    const breadcrumbsSize =
      size || inputGroupSize || formControlSize || controlSize;
    const breadcrumbsColor = splitedColor[0] || themeColor;
    const breadcrumbsColorLevel = splitedColor[1] || primaryColorLevel;

    const getBreadcrumbsSize = () => {
      let sizeClass = "";
      switch (breadcrumbsSize) {
        case SIZES.LG:
          sizeClass = classNames(`h-${CONTROL_SIZES.lg} px-8 py-2 text-base`);
          break;
        case SIZES.SM:
          sizeClass = classNames(`h-${CONTROL_SIZES.sm} px-3 py-2 text-sm`);
          break;
        case SIZES.XS:
          sizeClass = classNames(`h-${CONTROL_SIZES.xs} px-3 py-1 text-xs`);
          break;
        default:
          sizeClass = classNames(`h-${CONTROL_SIZES.md} px-8 py-2`);
          break;
      }
      return sizeClass;
    };

    const solidColor = () => {
      const btn = {
        textColor: "text-white",
      };
      return getBtnColor(btn);
    };

    const twoToneColor = () => {
      const btn = {
        textColor: `text-${breadcrumbsColor}-${breadcrumbsColorLevel} dark:text-${breadcrumbsColor}-50`,
      };
      return getBtnColor(btn);
    };

    const defaultColor = () => {
      const btn = {
        textColor: `text-gray-600 dark:text-gray-100`,
      };
      return getBtnColor(btn);
    };

    const plainColor = () => {
      const btn = {
        textColor: `text-gray-600 dark:text-gray-100`,
      };
      return getBtnColor(btn);
    };

    const getBtnColor = ({ textColor }: BreadcrumbsColor) => {
      return `${textColor}`;
    };

    const btnColor = () => {
      switch (variant) {
        case "solid":
          return solidColor();
        case "twoTone":
          return twoToneColor();
        case "plain":
          return plainColor();
        case "default":
          return defaultColor();
        default:
          return defaultColor();
      }
    };

    const classes = classNames(
      defaultClass,
      btnColor(),
      getBreadcrumbsSize(),
      className,
    );

    let currentLink = "";
    let crumbArray = routLocation.pathname.split("/").filter(Boolean);

    const crumbs = crumbArray.map((crumb, index) => {
      currentLink += `/${crumb}`;
      let crumbText =
        idName && index === crumbArray.length - 1
          ? idName
          : t(
              `nav${currentLink
                .replace(/\//g, ".")
                .replace(/\.crm\./g, ".")}.text`,
            );

      if (index === crumbArray.length - 1) {
        crumbText = cutString(crumbText, 35);
      }

      return (
        <div key={crumb} className="crumb">
          <Link to={currentLink}>{crumbText}</Link>
        </div>
      );
    });
    return (
      <div ref={ref} className={classes} {...rest}>
        {crumbs}
      </div>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
