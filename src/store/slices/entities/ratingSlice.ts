import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";
import formateDateForPicker from "@/utils/formateDateForPicker";
import { Filter } from "@/@types";
import myCountTransfer from "@/utils/myCountTransfer";
import useStorage from "@/utils/hooks/useStorage";

export type RatingState = {
  data: any[];
  filters: Filter[];
  valueFilterLead: string[] | null;
  valueFilterDate: string;
  myCount: number;
  isLoading: boolean;
};

const initialState: RatingState = {
  data: [],
  filters: [],
  valueFilterLead: null,
  valueFilterDate: "",
  myCount: 0,
  isLoading: false,
};
const ratingSlice = createSlice({
  name: `${SLICE_ENTITY_NAME}/RATING`,
  initialState,
  reducers: {
    setEntityRating(state, action: PayloadAction<any>) {
      const myID = useStorage().getItem("user");
      state.data = action.payload?.data;
      state.filters = action.payload?.filters;
      state.valueFilterDate = formateDateForPicker(
        action.payload?.meta?.date.date,
      );
      if (myID) {
        state.myCount = myCountTransfer(
          state.data,
          JSON.parse(myID).id,
          state.valueFilterDate,
        );
      }
      // state.valueFilterLead = "all";
    },
    updateEntityRating(state, action: PayloadAction<any>) {
      const myID = useStorage().getItem("user");
      if (myID) {
        state.myCount = myCountTransfer(
          [...state.data, action.payload],
          JSON.parse(myID).id,
          state.valueFilterDate,
        );
      }

      const filtered =
        state.valueFilterLead?.includes("all") ||
        state.valueFilterLead === null ||
        state.valueFilterLead.length === 0
          ? action.payload?.data.filter(
              (item: any) => item.date === state.valueFilterDate,
            )
          : action.payload?.data.filter((item: any) => {
              return (
                item.date === state.valueFilterDate &&
                state.valueFilterLead?.includes(item.team_leader.id)
              );
            });

      if (filtered.length !== 0) {
        state.data = filtered;
      }
    },
    setValueFilterLead(state, action: PayloadAction<string[]>) {
      state.valueFilterLead = action.payload;
    },
  },
});

export const { setEntityRating, updateEntityRating, setValueFilterLead } =
  ratingSlice.actions;
export default ratingSlice.reducer;
