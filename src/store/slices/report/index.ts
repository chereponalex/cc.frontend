import { combineReducers } from "@reduxjs/toolkit";
import reportInfo, { ReportState } from "./reportSlice";

const reducer = combineReducers({
  reportInfo,
});

export type ReportStateType = {
  report: ReportState;
};

export * from "./reportSlice";

export default reducer;
