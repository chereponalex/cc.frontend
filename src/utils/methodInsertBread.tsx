import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { createPortal } from "react-dom";

const methodInsert = (param: Element | null, name?: string) => {
  if (param !== null) {
    return createPortal(
      <Breadcrumbs
        idName={name}
        // className="pl-0 pr-0 flex items-center whitespace-nowrap"
      />,
      param,
    );
  }
  return null;
};

export default methodInsert;
