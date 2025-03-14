import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const isPassedDate = (dateToCheck: string) => {
  const moscowTimezone = "Europe/Moscow";
  const nowInMoscow = dayjs().tz(moscowTimezone);
  const dateToCompare = dayjs(dateToCheck);

  return dateToCompare.isBefore(nowInMoscow);
};
export default isPassedDate;
