import { combineReducers, CombinedState, AnyAction, Reducer } from "redux";
import auth, { AuthState } from "./slices/auth";
import base, { BaseState } from "./slices/base";
import locale, { LocaleState } from "./slices/locale/localeSlice";
import theme, { ThemeState } from "./slices/theme/themeSlice";
import map, { MapState } from "./slices/map/mapSlice";
import RtkQueryService from "@/services/RtkQueryService";
import uis, { UisState } from "./slices/uis/uisSlice";
import report, { ReportState } from "./slices/report/reportSlice";
import ws, { WSState } from "./slices/ws/wsSlice";
import entities from "./slices/entities";

export type RootState = CombinedState<{
  auth: CombinedState<AuthState>;
  base: CombinedState<BaseState>;
  locale: LocaleState;
  theme: ThemeState;
  map: MapState;
  uis: UisState;
  report: ReportState;
  ws: WSState;
  //TODO дописать типы для всех entities
  entities: any;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [RtkQueryService.reducerPath]: any;
}>;

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  base,
  locale,
  theme,
  map,
  uis,
  report,
  ws,
  entities,
  [RtkQueryService.reducerPath]: RtkQueryService.reducer,
};

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState, action: AnyAction) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });
    return combinedReducer(state, action);
  };

export default rootReducer;
