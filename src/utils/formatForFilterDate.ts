import dayjs from "dayjs";

const formatForFilterDate = (rangeDate: { start: Date; end: Date }) => {
  const start = rangeDate?.start;
  const end = rangeDate?.end;

  const convertStart = dayjs(start);
  const convertEnd = dayjs(end);

  const moscowDateStart = convertStart.utcOffset(180);
  const moscowDateEnd = convertEnd.utcOffset(180);

  return [
    moscowDateStart.format("YYYY-MM-DD"),
    moscowDateEnd.format("YYYY-MM-DD"),
  ];
};

export default formatForFilterDate;
