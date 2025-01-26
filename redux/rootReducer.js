import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import chatReducer from "./slices/chat/chatSlice";
import { chatsApi } from "./actions/chat/chatsApi";
import { authApi } from "./actions/auth/authApi";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  [authApi.reducerPath]: authApi.reducer,
  [chatsApi.reducerPath]: chatsApi.reducer,
});

export default rootReducer;
