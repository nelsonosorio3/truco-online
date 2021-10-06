import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsInRoom } from '../../Redux/actions-types/roomsActions';
import socket from '../socket';
import GameRequest from '../GameRequest';

import styles from './styles/RoomsList.module.css';

export default function RoomsList(){
    const [allRooms, setAllRooms] = useState([]);
    // const [roomId, setRoomId] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('showActiveRooms', (rooms) => {
            setAllRooms([rooms]);
        });
        // socket.emit('bringActiveRooms') //automaticamente hacer update de rooms cuando hay cambios en allRooms?

        return () => {socket.off()}
    }, [allRooms]);

    useEffect(()=>{
        socket.emit('bringActiveRooms')  // traer todas las rooms disponibles al entrar
    }, []);

    useEffect(()=>{
        socket.on("newRoomCreated", () => {socket.emit('bringActiveRooms')}) //actualizar en tiempo real rooms disponibles
        return ()=>{
            socket.off("newRoomCreated");
        };
    });

    const joinRoom = async (event) => {
        event.preventDefault();
        socket.emit('joinRoom', (parseInt(event.target[0].value)), localStorage.user, localStorage.token);
        dispatch(setIsInRoom({isInRoom: true, roomId: parseInt(event.target[0].value)}));
    };

    return(
        <div>
            <GameRequest/>
            <div className={styles.roomsList}>
                {
                allRooms.length > 0
                ?   
                    allRooms[0].activeRooms.map(room => 
                    <div key={room.id}>
                        <form onSubmit={joinRoom}>
                            <button 
                                type='submit' 
                                value={room.id} 
                                className={styles.roomBtn}>Room Id: {room.id} | Host: {room.host}
                            </button>
                        </form>
                    </div>
                    )
                :
                    null
                }
            </div>
        </div>
    );
};