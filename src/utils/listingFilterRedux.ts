import convertDateFormat from "./convertDateToISO";
import isDateInRange from "./isDateInRange";

const mappedParams: { [key: string]: any } = {
  team_leader: { socketFieldName: "team_leader", searchKey: "id" },
  employee_id: { socketFieldName: "manager", searchKey: "id" },
  real_estate_building_id: {
    socketFieldName: "real_estate_building",
    searchKey: "id",
  },
  status: { socketFieldName: "status", searchKey: "key" },
  phone: { socketFieldName: "phone", searchKey: "" },
  external_id: { socketFieldName: "external_id", searchKey: "" },
  marketplace_id: { socketFieldName: "marketplace", searchKey: "id" },
  offer_id: { socketFieldName: "offer", searchKey: "id" },
  developer_id: { socketFieldName: "developer", searchKey: "id" },
  reconnected: { socketFieldName: "reconnected", searchKey: "key" },
  city_id: { socketFieldName: "city", searchKey: "id" },
  date: { socketFieldName: "date_time", searchKey: "start" },
};
const listingFilter = (
  data: any,
  filters: { [key: string]: string | string[] } | null,
) => {
  if (filters && Object.keys(filters).length !== 0) {
    const filtered = data.filter((el: any) => {
      let isAccepted = true;
      for (const filterKey in filters) {
        const value =
          typeof el[mappedParams[filterKey].socketFieldName] === "string"
            ? el[mappedParams[filterKey].socketFieldName]
            : el[mappedParams[filterKey].socketFieldName][
                mappedParams[filterKey].searchKey
              ];

        if (filters[filterKey].length === 0) {
          continue;
        }

        if (filters && filterKey === "date") {
          const {
            date: { start, end },
          }: any = filters;
          const convertStart = convertDateFormat(start);
          const convertEnd = convertDateFormat(end);
          const itemDate = convertDateFormat(el.date_time?.start);

          if (isDateInRange(convertStart, convertEnd, itemDate)) {
            isAccepted = true;
          } else {
            isAccepted = false;
          }
          continue;
        }

        if (filters && filters[filterKey]?.includes(value)) {
          isAccepted = true;
        } else {
          isAccepted = false;
          break;
        }
      }
      return isAccepted;
    });

    return filtered;
  }

  return data;
};

export default listingFilter;
