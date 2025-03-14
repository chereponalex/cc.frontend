import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_ENTITY_NAME } from "./constants";
import listingFilter from "@/utils/listingFilterRedux";

export type UpdatedTransfer = {
  id: string;
  int_id: number;
  last_name: string;
  name: string;
  middle_name: string | null;
  full_name: string;
  city: { id: string };
  client_name: null | string;
  country: { id: string };
  date_time: { start: string; end: string };
  developer: { id: string };
  external_id: string;
  manager: { id: string };
  marketplace: { id: string };
  offer: { id: string };
  phone: string;
  real_estate_building: {
    id: string;
    int_id: number;
    name: string;
  };
  reconnected: { [key: string]: string };
  records: string[];
  region: { id: string };
  status: { [key: string]: string };
  team_leader: { id: string };
};

export type TransferState = {
  data: { data: any[] | null; filters: any };
  valueFilter: { [key: string]: string } | null;
  valuePaginate: null | string;
  isLoading: boolean;
};

const initialState: TransferState = {
  data: { data: null, filters: [] },
  valueFilter: null,
  valuePaginate: null,
  isLoading: false,
};

const transferSlice = createSlice({
  name: `${SLICE_ENTITY_NAME}/TRANSFER`,
  initialState,
  reducers: {
    setEntityTransfers(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setEntityByIdTransfer(state, action: PayloadAction<UpdatedTransfer>) {
      if (state.data?.data === null) {
        return;
      }
      try {
        let existInArray = false;
        const updatedData =
          state?.data?.data?.map((item) => {
            if (item.id === action.payload.id) {
              existInArray = true;
              return { ...item, ...action.payload };
            }
            return item;
          }) || [];
        const filtered = listingFilter(
          !existInArray && state.valuePaginate === "1"
            ? [action.payload, ...updatedData]
            : updatedData,
          state.valueFilter,
        );

        if (state?.data?.data) {
          state.data.data = filtered;
        }
      } catch (error) {
        console.log(error);
      }
    },
    setFiltersTransfer(state, action: PayloadAction<any>) {
      state.valueFilter = action.payload;
    },
    setFilterPaginate(state, action: PayloadAction<string>) {
      state.valuePaginate = action.payload;
    },
  },
});

export const {
  setEntityTransfers,
  setEntityByIdTransfer,
  setFiltersTransfer,
  setFilterPaginate,
} = transferSlice.actions;
export default transferSlice.reducer;
