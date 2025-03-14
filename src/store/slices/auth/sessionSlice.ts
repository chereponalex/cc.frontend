import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { useStorage } from "@/utils/hooks/useStorage";

export interface SessionState {
  signedIn: boolean;
  token: string | null;
}

const initialState: SessionState = {
  signedIn: !!useStorage().getItem("token"),
  token: useStorage().getItem("token") || null,
};

const sessionSlice = createSlice({
  name: `${SLICE_BASE_NAME}/session`,
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<string>) {
      state.signedIn = true;
      state.token = action.payload;
    },
    signOutSuccess(state) {
      state.signedIn = false;
      state.token = null;
    },
  },
});

export const { signInSuccess, signOutSuccess } = sessionSlice.actions;
export default sessionSlice.reducer;
