import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const bookAppointment = createAsyncThunk(
  "appointments/book",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/appointments", payload);
      return data.appointment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

export const fetchMyAppointments = createAsyncThunk(
  "appointments/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/appointments/my");
      return data.appointments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load appointments");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(fetchMyAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
