import { combineReducers } from "@reduxjs/toolkit";
import uisInfo, { UisState } from "./uisSlice";

const reducer = combineReducers({
  uisInfo,
});

export type UisStateType = {
  uis: UisState;
};

export * from "./uisSlice";

export default reducer;
