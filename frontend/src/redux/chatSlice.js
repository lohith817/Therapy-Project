import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchConversation = createAsyncThunk(
  "chat/fetchConversation",
  async (otherUserId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/messages/${otherUserId}`);
      return data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load chat");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    messageReceived: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { messageReceived, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
