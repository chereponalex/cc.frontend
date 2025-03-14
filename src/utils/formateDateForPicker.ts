import dayjs from "dayjs";

const formateDateForPicker = (dateString: string | Date) => {
  const date = dayjs(dateString);
  const moscowDate = date.utcOffset(180);
  return moscowDate.format("YYYY-MM-DD");
};

export default formateDateForPicker;
