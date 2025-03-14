import { combineReducers } from "@reduxjs/toolkit";
import wsInfo, { WSState } from "./wsSlice";

const reducer = combineReducers({
  wsInfo,
});

export type ReportStateType = {
  ws: WSState;
};

export * from "./wsSlice";

export default reducer;
