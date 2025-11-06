import { createSlice } from '@reduxjs/toolkit';

const storedModule = sessionStorage.getItem("selectedModule");
const initialState = {
  selectedModule: storedModule || null,
  sidebarFiltered: !!storedModule,
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
  setSelectedModule: (state, action) => {
  state.selectedModule = action.payload;
  state.sidebarFiltered = true;
  sessionStorage.setItem("selectedModule", action.payload); 
},
    clearSelectedModule: (state) => {
      state.selectedModule = null;
      state.sidebarFiltered = false;
    },
  },
});

export const { setSelectedModule, clearSelectedModule } = moduleSlice.actions;
export default moduleSlice.reducer;

// Selectors
export const selectSelectedModule = (state) => state.module.selectedModule;
export const selectSidebarFiltered = (state) => state.module.sidebarFiltered; 