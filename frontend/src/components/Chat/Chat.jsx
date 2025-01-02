import React from 'react'
import {useSelector} from 'react-redux'
import { useNavigate,Link } from 'react-router-dom';

const Chat = () => {

    const username = useSelector((state) => state.username.username); 

    if(username == null) {
        return(<div>
            
            <h1>User is not authenticated! please login</h1>
        </div>)
    }

    return (
        <div>
            <button><Link to='/'>home</Link></button>
            <h1>{username}</h1>
        </div>
    )
}

export default Chat;
