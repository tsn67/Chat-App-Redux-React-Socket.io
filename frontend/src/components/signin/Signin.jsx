import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from '../theme/themeSplicer';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const Signin = () => {

    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [needRules, setRules] = useState(false);
    const [passwordError, setPassError] = useState(false);
    const [passwordMisMacth, setMisMatch] = useState(false);
    const [unknownError, setUnknownError] = useState('');
    const [status, setStatus] = useState('idle');
    const [onlineCount, setOnlineCount] = useState(0);
   

    useEffect(() => {

    }, [status]);

    useEffect(() => {

        const socket = io('https://chat-app-redux-react-socketio-production.up.railway.app/');
        socket.on('count', (msg) => {
            setOnlineCount(msg.newCount);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if(status == 'waiting') {
        return (<div className={container+" "+theme}><h1>Loading...</h1></div>);
    }

    var container = 'signin-container';
    var themeBtn = 'theme-btn';
    var formContainer = 'form-container';
    var formElement = 'form-element';
    var btnElement = 'btn-element';
    var headerContainer = 'header-container';

    function changeCurrentTheme() {
        dispatch(changeTheme(theme=='dark'?'light':'dark'));
    }

    function getUsername(event) {
        setUsername(event.target.value);
        if(username.length < 5) setRules(true);
        else setRules(false);
    }

    function getPassword(event) {
        setPassword(event.target.value);
        if(password.length < 6) setPassError(true);
        else setPassError(false);
    }

    function checkPassWord(event) {
        if(event.target.value != password) setMisMatch(true);
        else setMisMatch(false);
    }

    async function submitForm() {
        if(!needRules && !passwordError && !passwordMisMacth && username.length != 0 && password.length != 0) {
            
            try {
                setStatus('waiting');
                const data = {
                    username: username,
                    password: password
                }
                const response = await axios.post('https://chat-app-redux-react-socketio-production.up.railway.app/register', data);
                console.log(response.data);
                setStatus('idle');
                navigate('/');
            } catch(error) {
                setUnknownError('something went wrong');
                setTimeout(() => {setUnknownError('')}, 3000);
                setStatus('idle');
            }
            
            setUnknownError('');
            setPassError('');
            setUsername('');
        } else {
            setUnknownError('error! checkagain');
        }
    }

    return (
        <div className={container+' '+theme}>

            <div className={headerContainer+' '+theme}>
                <h2 className={theme}>C<span style={{color: "green"}}>ha</span>t T<span style={{color: "crimson"}}>ic</span>k</h2>
                <button onClick={changeCurrentTheme} id="theme-btn" className="dark"><img src={theme=='dark'?'./assets/night-mode.png':'./assets/sun.png'} alt=""/></button>
            </div>

            {needRules?<p className={theme=='dark'?'dark hint':'light hint'}>username must contain atleast 5 characters</p>:passwordError?<p className={theme=='dark'?'dark hint':'light hint'}>password must contain atleast 6 characters</p>:passwordMisMacth?<p className={theme=='dark'?'dark hint':'light hint'}>password is not same</p>:unknownError.length != 0?<p className={theme=='dark'?'dark hint':'light hint'}>unknownError.msg</p>:<p style={{color: 'transparent'}}>-</p>}
            <div className={formContainer+' '+theme}>
                
                <input type="text" className={formElement+" "+theme} placeholder="uesrname" onChange={getUsername}/>
                <input onChange={getPassword} type="password" className={formElement+" "+theme} placeholder="enter password"/>
                <input onChange={checkPassWord} type="password" className={formElement+" "+theme} placeholder="confirm password"/>
                <button onClick={submitForm} className={formElement+' '+btnElement+' '+theme}>signin</button>
                <Link to='/'>login?</Link>
            </div>

            <p id="online-p" className={theme}>online-{onlineCount}</p>
        </div>
    )
}

export default Signin;
