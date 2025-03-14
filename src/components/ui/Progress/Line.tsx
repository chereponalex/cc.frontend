import classNames from "classnames";
import { SIZES } from "../utils/constants";
import type { CommonProps } from "../@types/common";

interface LineProps extends CommonProps {
  percent: number;
  strokeColor?: string;
  size?: "sm" | "md";
  unlimited?: boolean;
}

const Line = (props: LineProps) => {
  const { percent, size, children, strokeColor, unlimited } = props;

  const progressBackgroundClass = classNames(
    "progress-bg",
    size === SIZES.SM ? "h-1.5" : "h-2",
    `bg-${strokeColor}`,
  );

  const minWidth = 3;
  const width = Math.max(minWidth, percent);

  // const stripedBackgroundStyle = {
  //   background: `
  //   repeating-linear-gradient(
  //     135deg,
  //     rgba(232, 121, 249, 1),
  //     rgba(232, 121, 249, 1) 5px,
  //     rgba(75, 85, 99, 1) 5px,
  //     rgba(75, 85, 99, 1) 10px
  //   )
  // `,
  // };
  return (
    <>
      <div className="progress-wrapper">
        <div className="progress-inner">
          <div
            className={progressBackgroundClass}
            style={{
              width: `${width}%`,
              // ...(unlimited ? stripedBackgroundStyle : {}),
            }}
          />
        </div>
      </div>
      {children}
    </>
  );
};

Line.displayName = "ProgressLine";

export default Line;
