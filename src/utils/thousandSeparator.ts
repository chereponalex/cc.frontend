const thousandSeparatorValue = (number: number) => {
  const integerPart = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return integerPart;
};

export default thousandSeparatorValue;
