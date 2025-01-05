import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate,Link, useAsyncError } from 'react-router-dom';
import { changeTheme } from '../theme/themeSplicer';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { nanoid } from '@reduxjs/toolkit';

const Chat = () => {

    const username = useSelector((state) => state.username.username); 
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const [onlineCount, setOnlineCount] = useState(0);
    const [messages, setMessage] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [webSocket, setSocket] = useState(null);

    if(username == null) {
        return(<div>
            <h1>User is not authenticated! please login</h1>
        </div>)
    }

    function changeCurrentTheme() {
        dispatch(changeTheme(theme=='dark'?'light':'dark'));
    }

    useEffect(() => {
        const socket = io('https://chat-app-redux-react-socketio-production.up.railway.app/');
        socket.on('count', (msg) => {
            setOnlineCount(msg.newCount);
        });

        setSocket(socket);
        socket.on('message', (obj) => {
            //console.log(obj.msgArr);
            setMessage(obj.msgArr);
        })

        if(username != null) {
            socket.emit('newChat', {
                username: username
            });
        }

        socket.on('newMsg', (msg) => {
            setMessage((prevMessages) => [...prevMessages, {user: msg.user, message: msg.message}]);
        });

        return () => {
            socket.disconnect();
        };     
    }, []);

    function sendMessage() {
        webSocket.emit('newMessage', {
            username: username,
            message: inputMsg
        });
        setInputMsg('');
    }

    var mainContainer = 'chat-container';
    var info = 'info';
    var chatView = 'chat-view';
    var chatMine = 'chats mine';
    var chatOthers = 'chats others';
    var editor = 'editor '

    function getMessage(msg) {
        if(msg.user == username) {
            return <div id={nanoid()} className={chatMine+' '+theme}><span className={theme}>you</span><p>{msg.message}</p></div>
        } else {
            return <div id={nanoid()} className={chatOthers+' '+theme}><span className={theme}>{msg.user}</span><p>{msg.message}</p></div>
        }
    }


    return (
        <div className={mainContainer+' '+theme}>
            <div className={info}>
                <p id="online-p" className={'chat '+theme}>online: {onlineCount}</p>
                <button onClick={changeCurrentTheme} id="theme-btn" className={theme}><img src={theme=='dark'?'./assets/night-mode.png':'./assets/sun.png'} alt=""/></button>
            </div>

            <div className={chatView+' '+theme}>
                {messages.map(getMessage)}
            </div>

            <div className={editor+theme}>
                <input onChange={(e) => {setInputMsg(e.target.value)}} value={inputMsg} placeholder={`chat as '${username}'`} className={theme} type="text"/>
                <button onClick={sendMessage}><img src="./assets/send.png" alt="send-icon"/></button>
            </div>

        </div>
    )
}

export default Chat;
