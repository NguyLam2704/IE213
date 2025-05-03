import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCartThunk} from './cartThunks';
import { apiLogin } from '../../apis/user';
import Cookies from 'js-cookie';

export const loginThunk = createAsyncThunk(
    '/login',
    async (credentials, { dispatch }) => {
    const res = await apiLogin(credentials);
// Lấy giá trị cookie với tên 'refreshtoken'
    const refreshToken = Cookies.get('refreshtoken');
    console.log(refreshToken, " fasdf");  // In giá trị của cookie
        // 1. Lưu token ngay khi có
    localStorage.setItem('authToken', res.token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user_id", res.user.id); // nếu có

    // console.log('authToken', res.token);
    // sau khi login thành công, dispatch fetchCart
    dispatch(fetchCartThunk());  // ← đổ đầy luôn cả product details
    return res;
    }
);
