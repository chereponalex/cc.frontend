import { ReportType } from "@/@types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ReportState = {
  reportInfo: ReportType;
  isLoading: boolean;
};

const initialState: ReportState = {
  reportInfo: {
    channel: "",
    date: "",
    link: "",
  },
  isLoading: false,
};

const reportSlice = createSlice({
  name: "REPORT",
  initialState,
  reducers: {
    setReportLink(state, action: PayloadAction<any>) {
      state.reportInfo = action.payload;
    },
    setLoadingReport(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setReportLink, setLoadingReport } = reportSlice.actions;
export default reportSlice.reducer;
