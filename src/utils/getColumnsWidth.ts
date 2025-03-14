const getColumnStyles = (columnId: string) => {
  switch (columnId) {
    case "accruals":
      return "120px";
    case "managers":
      return "300px";
    case "team_leader_name":
      return "170px";
    case "manager_name":
      return "170px";
    case "real_estate_building_name":
      return "160px";
    case "status_value":
      return "100px";
    case "region_name":
      return "160px";
    case "country_name":
      return "200px";
    case "offer_name":
      return "160px";
    case "select":
      return "10px";
    case "int_id":
      return "70px";
    case "name":
      return "200px";
    case "city":
      return "170px";
    case "line":
      return "220px";
    // case "phone":
    //   return "150px";
    case "updated_at":
      return "150px";
    case "country":
      return "150px";
    case "region":
      return "200px";
    case "color":
      return "150px";
    case "status":
      return "100px";
    case "time_on_car":
      return "120px";
    case "time_on_foot":
      return "120px";
    case "square":
      return "140px";
    case "roominess":
      return "100px";
    case "finishing":
      return "100px";
    default:
      return "auto";
  }
};

export default getColumnStyles;
