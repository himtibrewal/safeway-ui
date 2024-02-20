import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: 0 };

const ToastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: (state, action) => {
            state.value = action.payload;
        },
    },
});


export const { addToast } = ToastSlice.actions;

export default ToastSlice.reducer;