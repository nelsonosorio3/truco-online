import React, { useContext, useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'

import { setIsInRoom } from '../../Redux/actions-types/roomsActions';
import socket from '../socket';

export default function JoinRoomForm (){
    const [isJoining, setIsJoining] = useState(false);
    const dispatch = useDispatch()

    const joinRoom = async (event) => {
      event.preventDefault();
      let idGenerator = Math.floor(Math.random()*100000)
      socket.emit('joinRoom', (idGenerator))
      setIsJoining(false);
      dispatch(setIsInRoom({isInRoom: true, roomId: idGenerator}))
    }

    return(
      <div>
        <form onSubmit={joinRoom}>
          <button type='submit' >{isJoining ? 'Joining...' : 'Create new room'}</button>
        </form>
      </div>
    )

}