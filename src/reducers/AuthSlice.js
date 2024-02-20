import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "src/services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

const AuthSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.rejected, (state, action) =>{
                return { ...state, isLoggedIn: false, user: null, };
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                if (action.payload.response_status == 200) {
                    return { ...state, isLoggedIn: true, user: action.payload.response_data, };
                }
                return { ...state, isLoggedIn: false, user: null, };
            });
    },
});


export const loginAsync = createAsyncThunk(
    "user/login",
    async (body) => {
        const { username, password } = body;
        console.log(username, password);
        return authService.login(username, password).then(
            (data) => {
                return { user: data };
            },
            (error) => {
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                return { user: error };
            }
        );
    }

);



export default AuthSlice.reducer;
