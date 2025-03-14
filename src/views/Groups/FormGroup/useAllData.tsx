import {
  useGetEmployeesQuery,
  useGetStatusesQuery,
} from "@/services/RtkQueryService";

const useAllData = () => {
  const [employeesResult /* , statusesResult */] = [
    useGetEmployeesQuery({ per_page: "all" }),
    // useGetStatusesQuery({ per_page: "all" }),
  ];

  const isLoading = employeesResult.isLoading; /* || statusesResult.isLoading */

  return {
    employees: employeesResult.data,
    // statuses: statusesResult.data,
    isLoading,
  };
};
export default useAllData;
