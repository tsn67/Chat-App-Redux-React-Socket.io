import React from 'react';
import ReactDOM from 'react-dom/client';
import {store} from './store'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux'
import Login from './components/login/Login';
import Signin from './components/signin/Signin';
import Chat from './components/Chat/Chat';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" exact element={<Login/>} />
                    <Route path="/signin" element={<Signin/>} />
                    <Route path="/chat" element={<Chat/>} />
                </Routes>
            {/* <Route path="/signin" component={Signin} />
            <Route path="/chat" component={Chat} /> */}
            </Router>
        </Provider>
    </React.StrictMode>
);