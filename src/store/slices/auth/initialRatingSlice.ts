import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export interface InitialRatingState {
  initialRating: {
    count: number;
  } | null;
  isLoading: boolean;
}

const initialState: InitialRatingState = {
  initialRating: null,
  isLoading: false,
};

const initialRatingSlice = createSlice({
  name: `${SLICE_BASE_NAME}/initialRating`,
  initialState,
  reducers: {
    setInitialRating(state, action: PayloadAction<{ count: number }>) {
      state.initialRating = action.payload;
    },
    setLoadingInitRating(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setInitialRating, setLoadingInitRating } =
  initialRatingSlice.actions;
export default initialRatingSlice.reducer;
