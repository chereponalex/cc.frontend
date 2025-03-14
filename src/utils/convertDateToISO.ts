const convertDateFormat = (dateString: string): string => {
  if (!dateString) return "";

  const dateSeparator = dateString.includes(".") ? "." : "-";
  const [datePart, timePart = "00:00"] = dateString.split(" ");
  const dateParts = datePart.split(dateSeparator);

  let year, month, day;

  if (dateSeparator === ".") {
    [day, month, year] = dateParts;
  } else {
    [year, month, day] = dateParts;
  }

  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  const [hours, minutes = "00"] = timePart.split(":");
  const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  return `${year}-${month}-${day} ${formattedTime}`;
};

export default convertDateFormat;
