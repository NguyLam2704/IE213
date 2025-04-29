import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/user/userSlice'; 
import productReducer from '../../features/product/productSlice'
import { productApi } from '../../features/product/productApi';
import searchReducer from '../../features/search/searchSlice';
// import productsReducer from '../features/products/productsSlice';
import cartReducer from '../store/cartSlice.js'
export const store = configureStore({ // Khai báo store để lưu trữ state 
  reducer: {
    user: userReducer,
    [productApi.reducerPath]: productApi.reducer,
    cart: cartReducer,
    search: searchReducer,
    // products: productsReducer,
  },  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productApi.middleware)
});
