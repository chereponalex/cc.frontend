import dayjs from "dayjs";

const formatDate = (date: string, withoutTime?: boolean) => {
  if (withoutTime) {
    return dayjs(date).format("DD.MM.YYYY");
  } else {
    return dayjs(date).format("DD.MM.YYYY HH:mm");
  }
};

export default formatDate;
