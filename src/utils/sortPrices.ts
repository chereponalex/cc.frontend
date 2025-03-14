const sortPrices = (a: FlatOrApartment, b: FlatOrApartment): number => {
  const priceA = Number(a?.price.replace(/\s/g, ""));
  const priceB = Number(b?.price.replace(/\s/g, ""));
  return priceA - priceB;
};

export default sortPrices;
