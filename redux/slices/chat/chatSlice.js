import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // { chatId: [messages] }
  },
  reducers: {
    setMessages(state, action) {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = [...messages];
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId] = [...state.messages[chatId], message];
    },
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
