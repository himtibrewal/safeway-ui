import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducers/Counterslice"
import mainReducer  from "./reducers/MainSlice";
import AuthSlice from "./reducers/AuthSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    main: mainReducer,
    auth: AuthSlice,
  },
});
