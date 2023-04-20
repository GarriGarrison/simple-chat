import http from 'http';
import express from 'express';
import WebSocket from 'ws';

interface ExtWebSocket extends WebSocket {
  id?: string; // your custom property
  isAlive: boolean;
}

type MessageSocket = {
  type: string;
  data: string;
};

// const port = config.server || 5000;
const port = 5000;
const app = express();

const surrogateList: string[] = [];

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  //* connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //* log the received message and send it back to the client
    console.log('received: %s', message);

    const mess: MessageSocket = JSON.parse(message);

    switch (mess.type) {
      case 'ADD_SURROGATE':
        surrogateList.push(mess.data as string);
        wss.clients.forEach((client) => {
          const mes = JSON.stringify({ type: 'ADD_SURROGATE', data: surrogateList });
          client.send(mes);
        });
        break;
      case 'NEW_MESSAGE': {
        const mesData = JSON.stringify(mess.data);
        wss.clients.forEach((client) => {
          const mes = JSON.stringify({ type: 'NEW_MESSAGE', data: mesData });
          client.send(mes);
        });
        break;
      }
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
