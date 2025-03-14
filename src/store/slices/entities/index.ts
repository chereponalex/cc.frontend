import { combineReducers } from "@reduxjs/toolkit";
import rating, { RatingState } from "./ratingSlice";
import ratingWeekly, { RatingWeeklyState } from "./ratingWeeklySlice";
import transfers, { TransferState } from "./transferSlice";
import markers, { MarkersState } from "./markersSlice";
import weeklyCount, { RatingCountState } from "./ratingCountSlice";

const reducer = combineReducers({
  rating,
  ratingWeekly,
  transfers,
  markers,
  weeklyCount,
});

export type EntityState = {
  rating: RatingState;
  ratingWeekly: RatingWeeklyState;
  transfers: TransferState;
  markers: MarkersState;
  weeklyCount: RatingCountState;
};

export * from "./ratingSlice";
export * from "./transferSlice";
export * from "./markersSlice";
export * from "./ratingCountSlice";

export default reducer;
