import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";
import { RealEstateBuilding } from "@/@types";

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
      action: PayloadAction<{
        action: "hide" | "show" | "update";
        data: any;
      }>,
    ) {
      const { action: actionAdmin, data } = action.payload;

      if (!state.data?.data) return;

      const buildingIndex = state.data.data.findIndex(
        (item) => item.id === data.id,
      );

      switch (actionAdmin) {
        case "hide":
          if (data.offers.length === 0) {
            state.disabledOffer = data.id;
            state.data.data = state.data.data.filter(
              (item) => item.id !== data.id,
            );
          }
          break;

        case "show":
          if (buildingIndex >= 0) {
            state.data.data[buildingIndex] = data;
            if (state.disabledOffer === data.id) {
              state.disabledOffer = null;
            }
          } else {
            state.data.data.push(data);
            // state.disabledOffer = data.id;
          }
          break;

        case "update":
          if (buildingIndex >= 0) {
            state.data.data[buildingIndex] = data;
          }
          break;
      }
    },
    // updateEntityMarkers(
    //   state,
    //   action: PayloadAction<{ action: ActionMarker; data: FlatOrApartment }>,
    // ) {
    //   const actionAdmin = action.payload?.action;
    //   if (!state.data?.data) {
    //     return;
    //   }

    //   if (actionAdmin === "hide") {
    //     const disabledOfferId = action.payload?.data?.real_estate_building?.id;
    //     state.disabledOffer = disabledOfferId ?? null;
    //     const filtered = state?.data?.data?.filter((item) => {
    //       return item.id !== disabledOfferId;
    //     });
    //     state.data.data = filtered;
    //   }
    // },
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
