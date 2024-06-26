import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "src/services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { isLoggedIn: true, user: user, permissions: user.permissions } : { isLoggedIn: false, user: null, permissions: []};

const AuthSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.rejected, (state, action) =>{
                return { ...state, isLoggedIn: false, user: null, permissions: [],};
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                if (action.payload.response_status == 200) {
                    return { ...state, isLoggedIn: true, user: action.payload.response_data, permissions: user.permissions, };
                }
                return { ...state, isLoggedIn: false, user: null, permissions: [],};
            });
    },
});


export const loginAsync = createAsyncThunk(
    "user/login",
    async (body) => {
        const { username, password, type } = body;
        console.log(username, password);
        return authService.login(username, password, type).then(
            (data) => {
                return { user: data };
            },
            (error) => {
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                return { user: error.response.data };
            }
        );
    }

);



export default AuthSlice.reducer;
