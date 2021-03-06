import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from "socket.io-client";
import { useHistory } from "react-router-dom";


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;




const Chat = ({location}) => {
    let history = useHistory();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const ENDPOINT = 'https://mirakchatapp.herokuapp.com/'
    useEffect(() => {
        const {name,room} =queryString.parse(location.search);
        
        socket  = io(ENDPOINT)
        
        setName(name);
        setRoom(room);
        socket.emit('disconnect',{name,room});
        
        socket.emit('join',{name,room},(error) => {
            if(error) {
                alert(error);
                history.push('/');
            }
        });
        
        return () => {
            socket.emit('disconnect',{name,room});
            socket.off();
        }
    },[ENDPOINT,location.search])

    useEffect(() => {
        socket.on('message',message=>{
            setMessages(messages =>[...messages,message]);
            console.log(messages);
            
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
        },[])
        
    const sendMessage =(event) => {
        event.preventDefault();
        if( message) {
            socket.emit('sendMessage',message ,() => setMessage(''));
        }
    }

    
        return(
            <div className="outerContainer">
                <div className="container">
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
                <TextContainer users={users}/>
            </div>
        );
};


export default Chat;
