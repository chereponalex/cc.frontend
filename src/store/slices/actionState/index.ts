import { combineReducers } from "@reduxjs/toolkit";
import actions, { ActionState } from "./actionStateSlice";

const reducer = combineReducers({
  actions,
});
export type EntityState = {
  actions: ActionState;
};

export * from "./actionStateSlice";

export default reducer;
