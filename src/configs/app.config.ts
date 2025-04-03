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

// docker build --build-arg BACKEND_URL=http://195.2.70.213 -t front-img .
// docker run --name frontend --network=ccbackend_app-network -v ccbackend_frontend:/app docker.pkg.github.com/chereponalex/cc.frontend/front-image:latest

// docker run --name nginx-container --network my-network -p 80:80 -d nginx
// docker run --name file-server-container --network my-network -v /path/to/files:/data -d your-file-server-image

// коммитим apiPrefix для прокси на бэк,  __BACKEND_URL__ должен быть IP сервера удаленного
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
