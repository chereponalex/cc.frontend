import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const timezoneClient = (isoDateString: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dayjs
    .utc(isoDateString)
    .tz(userTimeZone)
    .format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");
};

export default timezoneClient;
