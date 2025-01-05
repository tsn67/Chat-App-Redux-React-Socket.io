import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '../theme/themeSplicer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addUsername } from './LoginSplicer';
import { io } from 'socket.io-client';

const Login = () => {

    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('null');
    const [onlineCount, setOnlineCount] = useState(0);

    var container = 'login-container';
    var themeBtn = 'theme-btn';
    var formContainer = 'form-container';
    var formElement = 'form-element';
    var btnElement = 'btn-element';
    var headerContainer = 'header-container';

    function changeCurrentTheme() {
        dispatch(changeTheme(theme=='dark'?'light':'dark'));
    }

    const backEndUrl = 'https://chat-app-redux-react-socketio-production.up.railway.app/confirmUser';

    useEffect(() => {

        const socket = io('https://chat-app-redux-react-socketio-production.up.railway.app/');
        socket.on('count', (msg) => {
            setOnlineCount(msg.newCount);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function loginUser() {
        if(username.length == 0) setError('username is empty!');
        else if(password.length <= 6) setError('password is wrong!');
        else {
        
            async function func1() {
                const response = await axios.post(backEndUrl, {
                    username: username,
                    password: password
                });
                //console.log(response.data);  
                if(response.data.status != 'failed') {
                    dispatch(addUsername(username));
                    navigate('/chat');
                } else {
                    setUsername('');
                    setPassword('');
                    setError('Sorry something went wrong, check again!');
                }
            }
            func1();
        }
    }

    return (
        <div className={container+' '+theme}>

            <div className={headerContainer+' '+theme}>
                <h2 className={theme}>C<span style={{color: "green"}}>ha</span>t T<span style={{color: "crimson"}}>ic</span>k</h2>
                <button onClick={changeCurrentTheme} id="theme-btn" className="dark"><img src={theme=='dark'?'./assets/night-mode.png':'./assets/sun.png'} alt=""/></button>
            </div>

            {error!='null'?<p style={theme=='dark'?{color:'yellow'}:{color:'crimson'}}>{error}</p>:<p style={{color: 'transparent'}}>-</p>}

            <div className={formContainer+' '+theme}>
                <input value={username} onChange={(e) => {setUsername(e.target.value);}} type="text" className={formElement+" "+theme} placeholder="uesrname"  />
                <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className={formElement+" "+theme} placeholder="password"/>
                <button onClick={loginUser} className={formElement+' '+btnElement+' '+theme}>login</button>
                <Link to='/signin'>signin?</Link>
            </div>

            <p id="online-p" className={theme}>online-{onlineCount}</p>
            {/* <button><Link to='/chat'>chattemptest</Link></button> */}
        </div>
    )
}

export default Login;
