import deepParseJson from "@/utils/deepParseJson";
import useStorage from "@/utils/hooks/useStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WSState = {
  wsInfo: boolean;
  wsChannels: string[];
};

const wsLink: Object =
  deepParseJson(useStorage().getItem("websocketLink")) || {};
const wsChannels: Object =
  deepParseJson(useStorage().getItem("wsChannels")) || [];

const initialState: WSState = {
  wsInfo: true,
  wsChannels: (wsChannels as string[]) || [],
};

const wsSlice = createSlice({
  name: "WS",
  initialState,
  reducers: {
    setWS(state, action: PayloadAction<boolean>) {
      state.wsInfo = action.payload;
    },
    setWsChannels(state, action: PayloadAction<string[]>) {
      state.wsChannels = action.payload;
    },
  },
});

export const { setWS, setWsChannels } = wsSlice.actions;
export default wsSlice.reducer;
