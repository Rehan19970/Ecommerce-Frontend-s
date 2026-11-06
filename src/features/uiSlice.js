import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartDrawerOpen: false,
  searchOpen: false,
  quickViewProduct: null,
  newsletterPopupShown: false,
  newsletterPopupOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    closeSearch: (state) => {
      state.searchOpen = false;
    },
    openQuickView: (state, action) => {
      state.quickViewProduct = action.payload;
    },
    closeQuickView: (state) => {
      state.quickViewProduct = null;
    },
    setNewsletterPopupShown: (state) => {
      state.newsletterPopupShown = true;
    },
    openNewsletterPopup: (state) => {
      state.newsletterPopupOpen = true;
    },
    closeNewsletterPopup: (state) => {
      state.newsletterPopupOpen = false;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleSearch,
  closeSearch,
  openQuickView,
  closeQuickView,
  setNewsletterPopupShown,
  openNewsletterPopup,
  closeNewsletterPopup,
} = uiSlice.actions;

export default uiSlice.reducer;