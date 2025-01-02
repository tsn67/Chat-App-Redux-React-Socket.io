import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    theme: 'dark'
}

const themeSplicer = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme(state, actions) {
            state.theme = actions.payload;
        }
    }
});

export const {changeTheme} = themeSplicer.actions;
export default themeSplicer.reducer;