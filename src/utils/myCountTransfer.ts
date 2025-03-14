import formateDateForPicker from "./formateDateForPicker";

const myCountTransfer = (
  ratingData: any,
  userId: string,
  compareDate: string | string[] | null[],
): number => {
  if (typeof compareDate === "string") {
    const foundItem = ratingData?.find((item: any) => {
      return item.employee?.id === userId && item.date === compareDate;
    });
    return foundItem ? foundItem.count : 0;
  } else if (Array.isArray(compareDate) && compareDate[0]) {
    const foundItem = ratingData?.find((item: any) => {
      const start = formateDateForPicker(item.date?.start);
      const end = formateDateForPicker(item.date?.end);

      return (
        item.employee?.id === userId &&
        start === compareDate[0] &&
        end === compareDate[1]
      );
    });
    return foundItem ? foundItem.count : 0;
  }

  return 0;
};

export default myCountTransfer;
