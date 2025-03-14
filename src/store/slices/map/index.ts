import { combineReducers } from "@reduxjs/toolkit";
import points, { MapState } from "./mapSlice";

const reducer = combineReducers({
  points,
});

export type MapStateType = {
  map: MapState;
};

export * from "./mapSlice";

export default reducer;
