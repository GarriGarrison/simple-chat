import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import * as dotenv from 'dotenv';
import { EventsSocket, Message, Surrogate } from 'src/type';


interface ExtWebSocket extends WebSocket {
  id?: string; // your custom property
  isAlive: boolean;
}


dotenv.config();

const { NODE_ENV, PORT_DEV, PORT_PROD } = process.env;

// const port = config.server || 3001;
const port = (NODE_ENV === 'production' ? PORT_PROD : PORT_DEV) || 3001;
const app = express(); 
const map = new Map();

const surrogateList: Surrogate[] = [];
const messageList: Message[] = [];

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, /*clientTracking: false, noServer: true*/ });

server.on('upgrade', (request, socket, head) => {
  console.log('Parsing session from request...');

  // sessionParser(request, {}, () => {
  //   if (!request.session?.user?.id) {
  //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  //     socket.destroy();
  //     return;
  //   }

  //   console.log('Session is parsed!');

  //   wss.handleUpgrade(request, socket, head, (ws) => {
  //     wss.emit('connection', ws, request);
  //   });
  // });
});


wss.on('connection', (ws: ExtWebSocket, request) => {
  // const {userId} = request.session;

  // map.set(userId, ws);
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  //* connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //* log the received message and send it back to the client
    // console.log('received: %s', message);

    const mess: EventsSocket = JSON.parse(message);

    switch (mess.type) {
      case 'ADD_SURROGATE': {
        surrogateList.unshift(mess.data);

        const mesData = JSON.stringify(surrogateList);
        wss.clients.forEach((client) => {
          const mes = JSON.stringify({ type: 'ADD_SURROGATE', data: mesData });
          client.send(mes);
        });
        break;
      }

      case 'NEW_MESSAGE': {
        messageList.unshift(mess.data);

        if (messageList.length > 100) {
          messageList.pop();
        }

        const mesData = JSON.stringify(messageList);
        wss.clients.forEach((client) => {
          const mes = JSON.stringify({ type: 'NEW_MESSAGE', data: mesData });
          client.send(mes);
        });
        break;
      }

      case 'GET_MESSAGE':
        const mesData = JSON.stringify(messageList);
        const mes = JSON.stringify({ type: 'GET_MESSAGE', data: mesData });
        ws.send(mes);
        break;
    }

    //* Обработка широковещательных запросов
    // const broadcastRegex = /^broadcast\:/;

    // if (broadcastRegex.test(message)) {
    //   message = message.replace(broadcastRegex, '');

    //   //* send back the message to the other clients
    //   wss.clients.forEach((client) => {
    //     if (client != ws) {
    //       client.send(`Hello, broadcast message -> ${message}`);
    //     }
    //   });
    // } else {
    //   ws.send(`Hello, you sent -> ${message}`);
    // }
  });

  // ws.on('close', () => {
  //   map.delete(userId);
  // });
});

setInterval(() => {
  wss.clients.forEach((ws: WebSocket) => {
    const extWs = ws as ExtWebSocket;

    if (!extWs.isAlive) return ws.terminate();

    extWs.isAlive = false;
    ws.ping(null, undefined, undefined);
  });
}, 10000);

server.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
