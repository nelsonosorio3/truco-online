import React, {useState, useEffect, useRef} from 'react';
import socket from '../socket';
import styles from './styles/Chat.module.css'


export default function Chat ({name, roomId, typeofChat}) {
    const [msg, setMsg] = useState('');
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        socket.emit('connected', name);
    }, [name])

    useEffect(() => {
        socket.on('messages', (message) => {
            console.log(message)
            setMsgs([...msgs, message]);
        })

        return () => {socket.off()}
    }, [msgs])

    const divRef = useRef(null);

    useEffect(() => {
        divRef.current.scrollIntoView({behavior: 'smooth'})
    })

    const submit = (event) => {
        event.preventDefault();
        socket.emit('message', ({name, msg, roomId}));
    }

    return(
        <div>
            <div className={typeofChat==='chatLobby' ? styles.chatLobby : styles.chatGame}>
                {msgs.map((element, i) => ( <div key={i}><div>{element.name}</div><div>{element.msg}</div></div> ))}
                <div ref={divRef}></div>
            </div>
            <form onSubmit={submit} className={styles.writeMessage}>
                {
                    typeofChat==='chatLobby'
                    ? <textarea placeholder={'Message...'} name="" id="" cols="95" rows="1" value={msg} onChange={event => setMsg(event.target.value)}></textarea>
                    : <textarea placeholder={'Message...'} name="" id="" cols="31" rows="1" value={msg} onChange={event => setMsg(event.target.value)}></textarea>
                }
                <button className={styles.btn}>Send</button>
            </form>
        </div>
    )
}