import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../apis/axios';
import { fetchCartThunk, fetchCartWithProductsThunk } from './cartThunks';
import { apiLogin } from '../../apis/user';

export const loginThunk = createAsyncThunk(
    '/login',
    async (credentials, { dispatch }) => {
    const res = await apiLogin(credentials);
    // console.log("login thunk: ",res)
    // 1. Lưu token ngay khi có
    localStorage.setItem('authToken', res.token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user_id", res.user.id); // nếu có

    // console.log('authToken', res.token);
    // sau khi login thành công, dispatch fetchCart
    dispatch(fetchCartWithProductsThunk());  // ← đổ đầy luôn cả product details
    return res;
    }
);
