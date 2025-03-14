import sessionStorage from "redux-persist/es/storage/session";

export const storageList = {
  local: localStorage,
  session: sessionStorage,
};

export const storage = storageList.local;

export default storage;
