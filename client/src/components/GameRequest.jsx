import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useHistory } from "react-router-dom";

import axios from 'axios';
import socket from './socket';

import Chat from './rooms/Chat';

import { setIsInRoom } from '../Redux/actions-types/roomsActions';

import styles from './styles/GameRequest.module.css';

export default function GameRequest({tournamentMatchId}) {
  const {id} = useSelector(state => state.logReducer)

  const history = useHistory();

  const dispatch = useDispatch();

  const [data, setData] = useState({
    nameFriend: "",
    show: false,
    roomId: null,
  });

  const onAccept = ()=>{
    socket.emit('joinRoom', (data.roomId));
    dispatch(setIsInRoom({isInRoom: true, roomId: data.roomId}))
    history.push("/rooms")
    setData({nameFriend: "", show: false, roomId: null});
    
    // socket.emit("game accepted", socket.id, )
  };

  const onReject = ()=>{
    setData({nameFriend: "", show: false, roomId: null,});
  };

  useEffect(()=>{
    socket.on("invite to game", (roomId, idReceiver, nameSender)=>{
      if(idReceiver == localStorage.id) setData({nameFriend: nameSender, show: true, roomId, roomId})
    })
  });

  return (
    <div style={{display: data.show? "flex" : "none"}} id={styles.gameRequest}>
      <h3>Tu amigo {data.nameFriend} quiere invitarte a un juego</h3>
      <div id={styles.frienRequestButtons}>
        <button onClick={onAccept}>Aceptar</button>
        <button onClick={onReject}>Rechazar</button>
      </div>
    </div>
  );
};