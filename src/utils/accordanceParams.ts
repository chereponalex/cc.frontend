import { separateNumbers } from "./separateNumbers";

const accordanceParams = (script: string, variableObj: any) => {
  try {
    const parts = script?.split(/(\$\{[^}]+\})/);
    let result = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith("${") && part.endsWith("}")) {
        const variableName = part.slice(2, -1);
        // console.log(variableName, 'variableName')
        if (variableObj) {
          if (
            variableName === "deadline" ||
            variableName === "finishing" ||
            variableName === "roominess" ||
            variableName === "type"
          ) {
            result +=
              `<strong style="white-space: nowrap; font-weight: 900">${variableObj[variableName]?.value}</strong>` ||
              "__";
          } else {
            if (variableName.split("*").length === 2 && variableObj["price"]) {
              const coefficient = variableName.split("*")[1];
              result +=
                `<strong style="white-space: nowrap">${separateNumbers(
                  Number(variableObj["price"].replace(/\s/g, "")) *
                    Number(coefficient),
                )}</strong>` || "__";
            } else {
              result +=
                `<strong style="white-space: nowrap">${variableObj[variableName]}</strong>` ||
                "__";
            }
          }
        } else {
          result += "__";
        }
      } else {
        result += part;
      }
    }
    return result;
  } catch (error) {
    console.error("Error in accordanceParams:", error);
    return "__";
  }
};

export default accordanceParams;
