import { UISType } from "@/@types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UisState = {
  uisInfo: UISType;
  active_transfer: any | null;
  uisEvent: string | null;
  legIDClient: number | null;
  isLoading: boolean;
};

const initialState: UisState = {
  uisInfo: {
    employee_id: null,
    channel: "",
    notification_name: "",
    event: {
      key: "",
      value: "",
    },
    virtual_phone_number: "",
    notification_time: "",
    site_domain_name: "",
    advertising_campaign: "",
    contact_info: {
      contact_phone_number: "",
      visitor_id: "",
      search_query: "",
      communication_number: "",
      visitor_is_new: false,
      search_engine: "",
    },
    call_info: {
      call_source: "",
      direction: "",
      call_session_id: 0,
      talk_time_duration: 0,
      total_time_duration: 0,
      wait_time_duration: 0,
      tag_names: [],
    },
    call_session_id: 0,
    communication_id: 0,
    leg_id: 0,
  },
  active_transfer: null,
  legIDClient: null,
  uisEvent: null,
  isLoading: true,
};

const uisSlice = createSlice({
  name: "UIS",
  initialState,
  reducers: {
    setUisInfo(state, action: PayloadAction<any>) {
      state.uisInfo = { ...state.uisInfo, ...action.payload };
    },
    setActiveTransfer(state, action: PayloadAction<any>) {
      state.active_transfer = action.payload;
    },
    setClearUisInfo(state) {
      state.uisInfo = { ...initialState.uisInfo };
      state.uisEvent = null;
      state.legIDClient = null;
    },
    setUisEvent(state, action: PayloadAction<string>) {
      state.uisEvent = action.payload;
    },
    setLegIDClient(state, action: PayloadAction<number>) {
      if (state.legIDClient === null) {
        state.legIDClient = action.payload;
      }
    },
  },
});

export const {
  setUisInfo,
  setActiveTransfer,
  setClearUisInfo,
  setUisEvent,
  setLegIDClient,
} = uisSlice.actions;
export default uisSlice.reducer;
