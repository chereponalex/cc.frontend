import { forwardRef } from "react";
import classNames from "classnames";
import type { ComponentPropsWithRef, ElementType } from "react";
import { useAppSelector } from "@/store";
import { ScrollBar } from "@/components/ui/ScrollBar";

export interface TableProps extends ComponentPropsWithRef<"table"> {
  asElement?: ElementType;
  borderlessRow?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  overflow?: boolean;
  noScrolling?: boolean;
  transaction?: boolean;
  collapseHeight?: number;
}

const Table = forwardRef<HTMLElement, TableProps>((props, ref) => {
  const {
    asElement: Component = "table",
    borderlessRow,
    children,
    className,
    compact = true,
    hoverable = true,
    overflow = true,
    noScrolling,
    transaction,
    collapseHeight,
    ...rest
  } = props;

  const defaultHeithMin = 220;
  const direction = useAppSelector((state) => state.theme.direction);

  const tableClass = classNames(
    Component === "table" ? "table-default" : "table-flex",
    hoverable && "table-hover",
    compact && "table-compact",
    borderlessRow && "borderless-row",
    className,
  );

  if (noScrolling) {
    return (
      <Component className={tableClass} {...rest} ref={ref}>
        {children}
      </Component>
    );
  } else {
    return (
      <ScrollBar
        className={classNames(overflow && "overflow-x-auto")}
        autoHeight
        autoHeightMin={`calc(100vh - ${
          !transaction
            ? 290
            : collapseHeight
              ? collapseHeight + defaultHeithMin
              : defaultHeithMin
        }px)`}
        // autoHeightMin={`calc(100vh - ${transaction ? 200 : 200}px)`}
        direction={direction}
      >
        <Component className={tableClass} {...rest} ref={ref}>
          {children}
        </Component>
      </ScrollBar>
    );
  }
});

Table.displayName = "Table";

export default Table;
