import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // { userId: [messages] }
  },
  reducers: {
    setMessages(state, action) {
      const { userId, messages } = action.payload;
      state.messages[userId] = messages;
    },
    addMessage(state, action) {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = [];
      }
      state.messages[userId].push(message);
    },
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
