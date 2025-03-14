import dayjs from "dayjs";

const getWeekRange = (date: Date): [Date, Date] => {
  const startOfWeek = dayjs(date).startOf("week").toDate();
  const endOfWeek = dayjs(date).endOf("week").toDate();
  return [startOfWeek, endOfWeek];
};

export default getWeekRange;
