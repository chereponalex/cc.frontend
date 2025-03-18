import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export interface ActionState {
  drawer: boolean;
}

const initialState: ActionState = {
  drawer: false,
};

const actionStateSlice = createSlice({
  name: `${SLICE_BASE_NAME}/drawer`,
  initialState,
  reducers: {
    setDrawerState(state, action: PayloadAction<boolean>) {
      state.drawer = action.payload;
    },
  },
});

export const { setDrawerState } = actionStateSlice.actions;
export default actionStateSlice.reducer;
