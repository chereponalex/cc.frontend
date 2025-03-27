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
  // apiPrefix: "https://dev.api.lidofon.com/api/v1",
  apiPrefix: "http://localhost:8000",
  uisApi: "https://callapi.uiscom.ru/v4.0",
  authenticatedEntryPath: `${routePrefix.rating}?tab=daily`,
  unAuthenticatedEntryPath: "/sign-in",
  tourPath: "/",
  locale: "ru",
  fallbackLng: "ru",
  enableMock: false,
  // wsLink: "wss://dev.api.lidofon.com//ws",
  // wsLink: "wss://websocket.manager.place",
  wsLink: "http://localhost:8000/websockets",
};

export default appConfig;
