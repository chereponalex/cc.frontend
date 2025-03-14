import { combineReducers } from "@reduxjs/toolkit";
import session, { SessionState } from "./sessionSlice";
import user, { UserState } from "./userSlice";
import expired, { ExpiredTokenState } from "./expiredTokenSlice";
import rating, { InitialRatingState } from "./initialRatingSlice";

const reducer = combineReducers({
  session,
  user,
  expired,
  rating,
});

export type AuthState = {
  session: SessionState;
  user: UserState;
  expired: ExpiredTokenState;
  rating: InitialRatingState;
};

export * from "./sessionSlice";
export * from "./userSlice";
export * from "./expiredTokenSlice";
export * from "./initialRatingSlice";

export default reducer;
