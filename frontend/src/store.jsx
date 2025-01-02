import {configureStore} from '@reduxjs/toolkit'
import loginSplicer from './components/login/LoginSplicer'
import themeSplicer from './components/theme/themeSplicer';

const store = configureStore({
    reducer: {
        username: loginSplicer,
        theme: themeSplicer
    }
});

export {store};