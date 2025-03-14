import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { userRole } from "@/@types/auth";
import deepParseJson from "@/utils/deepParseJson";
import { useStorage } from "@/utils/hooks/useStorage";

export type UserState = {
  avatar?: string;
  login?: string;
  email?: string;
  authority?: string[];
  role?: userRole | null;
  name?: string;
  last_name?: string;
  id?: string;
  full_name: string;
  status: { [key: string]: string };
};

const user: Object = deepParseJson(useStorage().getItem("user")) || {};

const initialState: UserState = {
  avatar: "",
  login: (user as any)?.login || "",
  email: (user as any)?.email || "",
  authority: [],
  role: (user as any)?.role || null,
  name: (user as any)?.name || "",
  last_name: (user as any)?.last_name || "",
  id: (user as any)?.id || "",
  full_name: (user as any)?.full_name || "",
  status: (user as any)?.status || null,
};

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.name = action.payload?.name;
      state.last_name = action.payload?.last_name;
      state.avatar = action.payload?.avatar;
      state.email = action.payload.email;
      state.login = action.payload?.login;
      state.authority = action.payload?.authority;
      state.role = action.payload?.role;
      state.full_name = action.payload?.full_name;
      state.status = action.payload?.status;
    },
    updateUser(state, action: PayloadAction<any>) {
      state.name = action.payload.name;
      state.last_name = action.payload.last_name;
      state.role = action.payload.role;
      state.email = action.payload.email;
      useStorage().setItem("user", JSON.stringify({ ...user, ...state }));
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
