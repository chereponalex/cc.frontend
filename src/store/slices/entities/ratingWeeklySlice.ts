import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";
import { Filter } from "@/@types";
import myCountTransfer from "@/utils/myCountTransfer";
import useStorage from "@/utils/hooks/useStorage";
import formatForFilterDate from "@/utils/formatForFilterDate";
import isDateInRange from "@/utils/isDateInRange";

export type RatingWeeklyState = {
  data: any[];
  filters: Filter[];
  valueFilterLeadWeekly: string[] | null;
  valueFilterDateWeekly: string[];
  myCount: number;
  isLoading: boolean;
};

const initialState: RatingWeeklyState = {
  data: [],
  filters: [],
  valueFilterLeadWeekly: null,
  valueFilterDateWeekly: [],
  myCount: 0,
  isLoading: false,
};

const ratingWeeklySlice = createSlice({
  name: `${SLICE_ENTITY_NAME}/RATING_WEEKLY`,
  initialState,
  reducers: {
    setEntityRatingWeekly(state, action: PayloadAction<any>) {
      const myID = useStorage().getItem("user");
      state.data = action.payload?.data;
      state.filters = action.payload?.filters;
      state.valueFilterDateWeekly = formatForFilterDate(
        action.payload?.meta?.date,
      );
      if (myID) {
        state.myCount = myCountTransfer(
          state.data,
          JSON.parse(myID).id,
          state.valueFilterDateWeekly,
        );
      }
      // state.valueFilterLead = "all";
    },
    updateEntityRatingWeekly(state, action: PayloadAction<any>) {
      const myID = useStorage().getItem("user");
      if (myID) {
        state.myCount = myCountTransfer(
          [...state?.data, action.payload],
          JSON.parse(myID).id,
          state.valueFilterDateWeekly,
        );
      }

      const filtered =
        state.valueFilterLeadWeekly?.includes("all") ||
        state.valueFilterLeadWeekly === null ||
        state.valueFilterLeadWeekly.length === 0
          ? action.payload?.data.filter((item: any) => {
              return isDateInRange(
                state.valueFilterDateWeekly[0],
                state.valueFilterDateWeekly[1],
                item.date?.start,
              );
            })
          : action.payload?.data.filter((item: any) => {
              return (
                isDateInRange(
                  state.valueFilterDateWeekly[0],
                  state.valueFilterDateWeekly[1],
                  item.date?.start,
                ) && state.valueFilterLeadWeekly?.includes(item.team_leader.id)
              );
            });

      if (filtered.length !== 0) {
        state.data = filtered;
      }
    },
    setValueFilterLeadWeekly(state, action: PayloadAction<string[]>) {
      state.valueFilterLeadWeekly = action.payload;
    },
  },
});

export const {
  setEntityRatingWeekly,
  updateEntityRatingWeekly,
  setValueFilterLeadWeekly,
} = ratingWeeklySlice.actions;
export default ratingWeeklySlice.reducer;
