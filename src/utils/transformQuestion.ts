import { Entity } from "@/@types";
import accordanceParams from "./accordanceParams";

export const transFormToOrigin = (
  ids: { [key: string]: string },
  questions: Entity[],
  variableObj: any,
) => {
  let newKeys: { [key: string]: string } = {};
  Object.keys(ids).forEach((key) => {
    const findedFirst = questions.find((el) => el.id === key);
    if (findedFirst?.text) {
      newKeys[accordanceParams(findedFirst.text, variableObj)] = ids[key];
    }
  });
  return newKeys;
};
