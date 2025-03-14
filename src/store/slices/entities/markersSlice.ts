import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";

export type MarkersState = {
  data: { data: MapPoint[] | null; filters: any };
  valueFilterMap: null | {};
  disabledOffer: null | string;
  isLoading: boolean;
};

const initialState: MarkersState = {
  data: { data: null, filters: [] },
  valueFilterMap: null,
  disabledOffer: null,
  isLoading: false,
};

const markersSlice = createSlice({
  name: `${SLICE_ENTITY_NAME}/MARKERS`,
  initialState,
  reducers: {
    setEntityMarkers(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    updateEntityMarkers(
      state,
      action: PayloadAction<{ action: ActionMarker; data: FlatOrApartment }>,
    ) {
      const actionAdmin = action.payload?.action;
      if (!state.data?.data) {
        return;
      }
      if (actionAdmin === "hide") {
        const disabledOfferId = action.payload?.data?.real_estate_building?.id;
        state.disabledOffer = disabledOfferId ?? null;
        const filtered = state?.data?.data?.filter((item) => {
          return item.id !== disabledOfferId;
        });
        state.data.data = filtered;
      }
    },
    clearDisabledOffer(state, action: PayloadAction<null>) {
      state.disabledOffer = action.payload;
    },
    setFiltersMap(state, action: PayloadAction<{ [key: string]: string }>) {
      state.valueFilterMap = action.payload;
    },
  },
});

export const {
  setEntityMarkers,
  setFiltersMap,
  updateEntityMarkers,
  clearDisabledOffer,
} = markersSlice.actions;
export default markersSlice.reducer;
