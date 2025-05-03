import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';

const authSlice = createSlice({
    name: 'auth',
    initialState: { isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("authToken") || null, userId: null, status: 'idle', error: null },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
        state.token = null;
        state.userId = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        state.isAuthenticated = false;
        localStorage.removeItem("isAuthenticated");
        },
    },
    extraReducers: builder => {
        builder
        .addCase(loginThunk.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.token  = action.payload.token;
            state.userId = action.payload.user._id;
            state.isAuthenticated = true;
            // lưu localStorage
            localStorage.setItem('authToken', state.token);
            localStorage.setItem('userId', state.userId);
            localStorage.setItem("isAuthenticated", "true");
        })
        .addCase(loginThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error  = action.error.message;
        });
    }
});

export const selectIsAuthenticated = (state) => !!state.auth.token;

export const { logout,setAccessToken } = authSlice.actions;
export default authSlice.reducer;
