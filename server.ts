import { WebSocketServer } from 'ws';
import { WS_PORT } from './settings.js';
import { PingMessage, PongMessage, MessageKind } from './shared.js';

const wss = new WebSocketServer({ port: WS_PORT });

/* 
// First attempt
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    // pong
    ws.send(`${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); */

/* 
// Second attempt
wss.on('connection', (ws) => {
  ws.binaryType = 'arraybuffer';

  console.log('Client connected');

  ws.on('message', (message) => {
    if (!(message instanceof ArrayBuffer)) {
      console.log('Invalid message type');
      return;
    }

    // pong
    const timeStamp = new DataView(message).getFloat32(0);
    const pong = new DataView(new ArrayBuffer(4));
    pong.setFloat32(0, timeStamp);

    ws.send(pong);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); */

/* 
// Third attempt
wss.on('connection', (ws) => {
  ws.binaryType = 'arraybuffer';

  console.log('Client connected');

  ws.on('message', (message) => {
    if (!(message instanceof ArrayBuffer)) {
      console.log('Invalid message type');
      return;
    }

    // pong
    const ping = new DataView(message);
    const pong = new DataView(new ArrayBuffer(PongMessage.size));
    PongMessage.kind.write(pong, MessageKind.Pong);
    PongMessage.timestamp.write(pong, PingMessage.timestamp.read(ping));

    ws.send(pong);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); */

wss.on('connection', (ws) => {
  ws.binaryType = 'arraybuffer';

  console.log('Client connected');

  ws.on('message', (message) => {
    if (!(message instanceof ArrayBuffer)) {
      console.log('Invalid message type');
      return;
    }

    const dataView = new DataView(message);

    if (PingMessage.validate(dataView)) {
      // pong
      const pong = new DataView(new ArrayBuffer(PongMessage.size));
      PongMessage.kind.write(pong, MessageKind.Pong);
      PongMessage.timestamp.write(pong, PingMessage.timestamp.read(dataView));

      ws.send(pong);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
