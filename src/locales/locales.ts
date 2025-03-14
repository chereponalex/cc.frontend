// eslint-disable-next-line import/no-named-as-default
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./lang/ru.json";

import appConfig from "@/configs/app.config";

const resources = {
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: appConfig.fallbackLng,
  lng: appConfig.locale,
  interpolation: {
    escapeValue: false,
  },
});

export const dateLocales: {
  [key: string]: () => Promise<ILocale>;
} = {
  ru: () => import("dayjs/locale/ru"),
};

export default i18n;
