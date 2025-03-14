const extractYearAndQuarter = (dateString: any) => {
  if (dateString) {
    const [year, month] = dateString?.key?.split("-");
    const quarter = Math.ceil(parseInt(month, 10) / 3);
    return {
      year: parseInt(year, 10),
      quarter,
    };
  }
};

export default extractYearAndQuarter;
