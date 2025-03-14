const regexDate = (str: string) => {
  console.log(str, "str");
  const regex = /квартал-(\d+) год-(\d+)/;
  const match = str.match(regex);

  if (match) {
    const quarter = match[1];
    const year = match[2];
    return `${quarter}-${quarter}-${year}`;
  } else {
    console.log("No match found.");
  }
};

export default regexDate;
