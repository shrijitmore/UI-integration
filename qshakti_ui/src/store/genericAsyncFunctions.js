import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "./genericService";

const methodMap = {
  get: apiService.get,
  post: apiService.post,
  put: apiService.put,
  patch: apiService.update,
  delete: apiService.delete,
  deleteMethodWithData:apiService.delete1,
  updateMethod: apiService.update1,
  postWIThFormData: apiService.post1,
  putwithformMethod: apiService.putwithformMethod,
};

export const createAsyncThunkAction = (typePrefix, method, urlBuilder) =>
  createAsyncThunk(typePrefix, async (payload, thunkAPI) => {
    try {
      const { url, data, headers = {} } = urlBuilder(payload, thunkAPI);
      const response = await methodMap[method](url, data, { headers });
      return response?.data || response;
    } catch (err) {
      const errorData = err.response?.data;

      let message = "Unexpected error";

      if (typeof errorData?.error === "string") {
        message = errorData.error;
      } else if (typeof errorData?.message === "string") {
        message = errorData.message;
      } else if (typeof errorData?.error === "object") {
        message = Object.entries(errorData.error)
          .map(
            ([field, msgs]) =>
              `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("; ");
      } else if (typeof err.message === "string") {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  });
