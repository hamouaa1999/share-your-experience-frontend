import { io } from 'socket.io-client';
import { SERVER_ADDRESS } from '../config';

export const socket = io('http://' + SERVER_ADDRESS + ':5555', {
    autoConnect: false
  });