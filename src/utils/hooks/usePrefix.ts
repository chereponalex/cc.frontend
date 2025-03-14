import routePrefix from "@/configs/routes.config/routePrefix";

export const usePrefix = (string: string): string | null => {
  if (["manager", "team_leader"].includes(string)) {
    return routePrefix.employee;
  }

  // @ts-ignore
  return routePrefix[string];
};

export default usePrefix;
