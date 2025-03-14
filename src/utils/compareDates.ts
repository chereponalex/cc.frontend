import dayjs from "dayjs";

const compareDates = (dateStr1: string, dateStr2: string) => {
  const date1 = dayjs(dateStr1, "DD.MM.YYYY");
  const date2 = dayjs(dateStr2, "DD.MM.YYYY HH:mm");
  console.log(date1, date2, "twodays");
  if (date1.isBefore(date2)) {
    console.log("Первая дата раньше второй");
  } else if (date1.isAfter(date2)) {
    console.log("Первая дата позже второй");
  } else {
    console.log("Даты равны");
  }
};

export default compareDates;
