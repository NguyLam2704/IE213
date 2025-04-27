// store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {apiAddItem, apiGetItem} from '../../apis/cart.js'; // giả sử bạn export apiAddItem từ đây
import { apiLogin } from '../../apis/user.js';

// 1. Tạo async thunk để gọi API và dispatch kết quả
export const addItemToCart = createAsyncThunk(
    'cart/',
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            
            const response = await apiAddItem({ product_id, quantity });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Lấy items trong cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
        const response = await apiGetItem();
        return response;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
);


const cartSlice = createSlice({
name: 'cart',
initialState: { items: [], status: 'idle', error: null,totalQuantity: 0},
reducers: {
    setCartCount: (state, action) => {
        state.totalQuantity = action.payload;
    },
    updateQuantity: (state, action) => {
    const { id, delta } = action.payload;
    const item = state.items.find(item => item._id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
    }
    },
    removeItem: (state, action) => {
    state.items = state.items.filter(item => item._id !== action.payload);
    },
},

extraReducers: builder => {
builder
    .addCase(addItemToCart.pending, state => {
    state.status = 'loading';
    state.error = null;
    })
    .addCase(addItemToCart.fulfilled, (state, action) => {
    state.status = 'succeeded';
    // Cập nhật item từ server
    state.item = action.payload;
    // Tính tổng số lượng sản phẩm trong giỏ
    state.totalQuantity += state.item.quantity;
    })
    .addCase(addItemToCart.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
    })
    .addCase(fetchCart.pending, state => {
        state.status = 'loading';
        state.error = null;
    })
    .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Update giỏ hàng
    })
    .addCase(fetchCart.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
    });
}
});

export const { setCartCount, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
