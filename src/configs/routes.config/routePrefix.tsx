export const mainPrefix = {
  crm: "/crm",
  map: "/map",
};

export const routePrefix = {
  home: `/home`,
  access_denied: `/access-denied`,
  developer: `${mainPrefix.crm}/developer`,
  real_estate_building: `${mainPrefix.crm}/real-estate-building`,
  payment_method: `${mainPrefix.crm}/payment-method`,
  tag: `${mainPrefix.crm}/tag`,
  offer: `${mainPrefix.crm}/offer`,
  marketplace: `${mainPrefix.crm}/marketplace`,
  work_time: `${mainPrefix.crm}/work-time`,
  question: `${mainPrefix.crm}/question`,
  script: `${mainPrefix.crm}/script`,
  transfer: `${mainPrefix.crm}/transfer`,
  real_estate_object: `${mainPrefix.crm}/real-estate-object`,
  country: `${mainPrefix.crm}/country`,
  region: `${mainPrefix.crm}/region`,
  metro_line: `${mainPrefix.crm}/metro-line`,
  metro_station: `${mainPrefix.crm}/metro-station`,
  employee: `${mainPrefix.crm}/employee`,
  city: `${mainPrefix.crm}/city`,
  black_list: `${mainPrefix.crm}/black-list`,
  role: `${mainPrefix.crm}/role`,
  profile: `${mainPrefix.crm}/profile`,
  settings: `${mainPrefix.crm}/setting`,
  groups: `${mainPrefix.crm}/group`,
  rating: `${mainPrefix.crm}/rating`,

  // ======== MAP ===== //
  map: `${mainPrefix.map}`,
};

export default routePrefix;
mainPrefix;
