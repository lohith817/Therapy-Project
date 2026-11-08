import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchTherapists = createAsyncThunk(
  "therapists/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/therapists?${params}`);
      return data.therapists;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load therapists");
    }
  }
);

const therapistSlice = createSlice({
  name: "therapists",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTherapists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTherapists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTherapists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default therapistSlice.reducer;
