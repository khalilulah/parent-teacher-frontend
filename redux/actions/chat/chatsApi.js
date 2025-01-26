import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../utils/utilFunctions";

export const chatsApi = createApi({
  reducerPath: "chatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: ({ userId, otherUserId }) => `/messages/${userId}/${otherUserId}`,
    }),
  }),
});

export const { useFetchChatsQuery } = chatsApi;
