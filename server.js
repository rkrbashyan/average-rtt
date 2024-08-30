import { WebSocketServer } from 'ws';
import { WS_PORT } from './settings.js';
import { PingMessage, PongMessage, MessageKind } from './shared.js';
const wss = new WebSocketServer({ port: WS_PORT });
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
