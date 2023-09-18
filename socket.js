import { Server } from 'socket.io';
import { createError } from './src/source/js/function/commonFn.js';

let io;

const socketIO = {
   initIO: (server) => {
      io = new Server(server, {
         cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
            credentials: true,
         },
      });
      return io;
   },
   getIO: () => {
      if (!io) {
         createError(404, '초기화된 소켓이 없습니다.');
      }
      return io;
   },
};

export default socketIO;
