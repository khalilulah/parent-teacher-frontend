import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../utils/utilFunctions";
import { setCredentials } from "../../slices/auth/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const loginResponse = {
            token: data?.data?.token,
            user: data?.data,
          };
          dispatch(setCredentials(loginResponse)); // Save token and user in the store
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    sendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sendOtp",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("OTP sending failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendOtpMutation } = authApi;
