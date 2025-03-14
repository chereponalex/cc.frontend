import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";

export type RatingCountState = {
  count: number | null;
  isLoading: boolean;
};

const initialState: RatingCountState = {
  count: null,
  isLoading: false,
};
const ratingCountSlice = createSlice({
  name: `${SLICE_ENTITY_NAME}/RATING_COUNT`,
  initialState,
  reducers: {
    updateRatingWeeklyCount(state, action: PayloadAction<{ count: number }>) {
      state.count = action.payload?.count;
    },
  },
});

export const { updateRatingWeeklyCount } = ratingCountSlice.actions;
export default ratingCountSlice.reducer;
