import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

const isDateInRange = (
  startDate: string,
  endDate: string,
  itemDate: string,
) => {
  dayjs.extend(isBetween);
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const item = dayjs(itemDate);

  return item.isBetween(start, end, null, "[]");
};

export default isDateInRange;
