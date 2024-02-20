import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    sidebarShow: true,
    sidebarUnfoldable: true,
    theme: 'light',
}


const MainSlice = createSlice({
    name: "main",
    initialState: initialState,
    reducers: {
        set: (state, action) => {
            console.log(state);
            return { ...state, ...action.payload }
        }
    },
});

export const { set } = MainSlice.actions;
export default MainSlice.reducer;
