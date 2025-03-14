interface RealEstateObject {
  id: string;
  int_id: number;
  price: string;
  square: number;
  price_per_meter: string;
  finishing: {
    key: string;
    value: string;
  };
  roominess: {
    key: string;
    value: string;
  };
  type: {
    key: string;
    value: string;
  };
  deadline: {
    key: string;
    value: string;
  };
}

enum TypeObject {
  FLAT = "FLAT",
  APARTMENTS = "APARTMENTS",
}

const infoScriptFunc = (infoScript: RealEstateObject | null) => {
  const infoScriptCopy = infoScript
    ? JSON.parse(JSON.stringify(infoScript))
    : null;

  if (
    infoScriptCopy?.type.key === TypeObject.APARTMENTS &&
    infoScriptCopy?.roominess?.key !== "C"
  ) {
    infoScriptCopy.roominess.value = infoScriptCopy.roominess.value.replace(
      "комнатная",
      "комнатные",
    );
  }

  const formatValue = (value: any) =>
    value ? `<strong>${value}</strong>` : "___";

  const roominessValue = formatValue(infoScriptCopy?.roominess?.value);
  const squareValue = formatValue(infoScriptCopy?.square);
  const deadlineValue = formatValue(infoScriptCopy?.deadline?.value);
  const priceValue = formatValue(infoScriptCopy?.price);
  const finishingValue = formatValue(infoScriptCopy?.finishing?.value);

  const objectType =
    infoScriptCopy === null
      ? "___"
      : infoScriptCopy?.type.key === TypeObject.APARTMENTS
        ? infoScriptCopy?.roominess?.key !== "C"
          ? "апартаменты"
          : "Апартаменты"
        : infoScriptCopy?.roominess?.key !== "C"
          ? "квартира"
          : "Квартира";

  let displayScript = `${roominessValue} ${objectType}, ${finishingValue}, площадью от ${squareValue} м² со сроком сдачи ${deadlineValue} здесь будет стоить от ${priceValue}₽. Может вам подойти?`;

  if (infoScriptCopy?.roominess?.key === "C") {
    displayScript = `${objectType} ${roominessValue}, ${finishingValue}, площадью от ${squareValue} м² со сроком сдачи ${deadlineValue} здесь будет стоить от ${priceValue}₽. Может вам подойти?`;
  }

  return displayScript;
};

export default infoScriptFunc;
