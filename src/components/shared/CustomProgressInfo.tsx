import React from "react";
import { FaStar } from "react-icons/fa";
import classNames from "classnames";

interface DisplayData {
  display: string;
  color: string;
  unlimited?: boolean;
}

interface CustomProgressInfoProps {
  count: number;
  display: () => DisplayData;
}

const CustomProgressInfo: React.FC<CustomProgressInfoProps> = ({
  count,
  display,
}) => {
  const displayData = display();
  return (
    <div className="flex items-center">
      <div className="whitespace-nowrap">
        {displayData?.unlimited
          ? `${count}/~`
          : `${count} из ${Number(displayData?.display) + 1}`}
      </div>
      <div className="ml-1 h-[15px]">
        <FaStar
          className={classNames(`text-${displayData?.color}`)}
          size={13}
          color={`${displayData?.color}`}
        />
      </div>
    </div>
  );
};

export default CustomProgressInfo;
