import routePrefix from "./routes.config/routePrefix";

export type AppConfig = {
  apiPrefix: string;
  uisApi: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  tourPath: string;
  locale: string;
  fallbackLng: string;
  enableMock: boolean;
  wsLink: string;
};


const appConfig: AppConfig = {
  apiPrefix: __BACKEND_URL__,
  uisApi: "https://callapi.uiscom.ru/v4.0",
  authenticatedEntryPath: `${routePrefix.rating}?tab=daily`,
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/",
  locale: "ru",
  fallbackLng: "ru",
  enableMock: false,
  wsLink: `${__BACKEND_URL__}/websockets`,
};

export default appConfig;
