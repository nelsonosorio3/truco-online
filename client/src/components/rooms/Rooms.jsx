import React, {useEffect, useState} from 'react';
import Chat from '../Chat';
import Socket from '../socket';

import JoinRoomForm from './JoinRoomForm';
import RoomsList from './RoomsList';

export default function Rooms() {
  console.log("localStorage in Rooms", localStorage)
  return (
    <div>
      <JoinRoomForm />
      <RoomsList />
    </div>
  );
}


