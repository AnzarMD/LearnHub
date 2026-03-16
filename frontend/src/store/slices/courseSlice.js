import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MOCK_COURSES } from "@constants/mockData";

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  await delay();
  return MOCK_COURSES;
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    items:   [],
    loading: false,
    error:   null,
  },
  reducers: {
    addCourse:    (state, a) => { state.items.push(a.payload); },
    updateCourse: (state, a) => {
      const idx = state.items.findIndex((c) => c.id === a.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...a.payload };
    },
    deleteCourse: (state, a) => { state.items = state.items.filter((c) => c.id !== a.payload); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchCourses.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchCourses.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});

export const { addCourse, updateCourse, deleteCourse } = courseSlice.actions;
export default courseSlice.reducer;
