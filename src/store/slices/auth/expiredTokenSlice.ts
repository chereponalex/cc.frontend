import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { useStorage } from "@/utils/hooks/useStorage";

export interface ExpiredTokenState {
  expired_token: string | null;
}

const initialState: ExpiredTokenState = {
  expired_token: useStorage().getItem("expired_token") || null,
};

const expiredTokenSlice = createSlice({
  name: `${SLICE_BASE_NAME}/expired`,
  initialState,
  reducers: {
    setExpiredToken(state, action: PayloadAction<string | null>) {
      state.expired_token = action.payload;
    },
  },
});

export const { setExpiredToken } = expiredTokenSlice.actions;
export default expiredTokenSlice.reducer;
