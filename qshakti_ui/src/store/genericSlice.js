// slices/genericSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const createGenericSlice = (
  name,
  initialState,
  reducers,
  extraReducers
) => {
  return createSlice({
    name,
    initialState,
    reducers,
    extraReducers,
  });
};
