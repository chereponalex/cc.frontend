export interface SelectOption {
  value: any;
}
const transformOptionsToString = (list: SelectOption[]): string => {
  return list
    .map((el: { value: any }) => el.value)
    .filter((el) => el !== "" || el != "all")
    .join(",");
};
export default transformOptionsToString;
