const transformMultipleOptionsToList = (query: string): string[] => {
  if (query != undefined) {
    return query.includes("all")
      ? query.split(",").filter((el: string) => el != "all" && el != "")
      : query.split(",");
  }
  return [];
};
export default transformMultipleOptionsToList;
