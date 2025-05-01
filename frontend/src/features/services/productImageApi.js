import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productImageApi = createApi({
  reducerPath: 'productImageApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}/api/v1/` }),
  endpoints: (builder) => ({
    createProductImage: builder.mutation({
      query: (formData) => ({
        url: `productImages/upload`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreateProductImageMutation } = productImageApi;
