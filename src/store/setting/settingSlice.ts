import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSideBar: true,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    handleSidebar: (state, action) => {
      state.isSideBar = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSideBar = !state.isSideBar;
    },
  },
});

export const { handleSidebar, toggleSidebar } = settingSlice.actions;
export default settingSlice.reducer;
