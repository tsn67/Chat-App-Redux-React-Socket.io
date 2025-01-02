import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    username: null
}

const loginSplicer = createSlice({
    name: 'username',
    initialState,
    reducers: {
        addUsername(state, actions) {
            state.username = actions.payload;
        }
    }
});

export default loginSplicer.reducer;
export const {addUsername} = loginSplicer.actions;
