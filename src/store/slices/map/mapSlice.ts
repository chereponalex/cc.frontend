import { City } from "@/@types";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export type MapState = {
  points: MapPoint[];
  isLoading: boolean;
  apiKey: string;
  defaultCity: null | City;
  engineerMode: boolean;
};

const initialState: MapState = {
  points: [],
  isLoading: true,
  apiKey: "",
  defaultCity: null,
  engineerMode: false,
};

const mapSlice = createSlice({
  name: "MAP",
  initialState,
  reducers: {
    setDefaultCity(state, action: PayloadAction<City>) {
      state.defaultCity = action.payload;
    },
    setApiKey(state, action: PayloadAction<any>) {
      state.apiKey = action.payload;
    },
    setPoints(state, action: PayloadAction<MapPoint[]>) {
      state.points = action.payload;
    },
    getPointById(state, action: PayloadAction<any>) {
      const newState = { ...state };
      const foundPoint = newState.points?.find((point) => {
        return point.id === action.payload;
      });
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setEngineerMode: (state, action: PayloadAction<boolean>) => {
      state.engineerMode = action.payload;
    },
    sendMapWSMessage: (
      state,
      action: PayloadAction<{ message: string; channel: string }>,
    ) => {
      window.dispatchEvent(
        new CustomEvent("send-socket-message", {
          detail: {
            message: action.payload.message,
            channel: action.payload.channel,
          },
        }),
      );
    },
  },
});

export const {
  setDefaultCity,
  setPoints,
  getPointById,
  setIsLoading,
  setEngineerMode,
  setApiKey,
  sendMapWSMessage,
} = mapSlice.actions;
export default mapSlice.reducer;
