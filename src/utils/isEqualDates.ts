import dayjs from "dayjs";

const isEqualDates = (date1: string, date2: string) => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date1) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date2)
  ) {
    return false;
  }

  const parsedDate1 = dayjs(date1);
  const parsedDate2 = dayjs(date2);

  return parsedDate1.isSame(parsedDate2, "day");
};

export default isEqualDates;
