import { WS_PORT } from './settings.js';
import { PingMessage, PongMessage, MessageKind } from './shared.js';
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.hostname}:${WS_PORT}`);
ws.binaryType = 'arraybuffer';
const startButton = document.getElementById('start');
const pingElement = document.getElementById('ping');
const averageRttElement = document.getElementById('average-rtt');
const rtts = [];
const MAX_PINGS = 20;
startButton.addEventListener('click', async () => {
    startButton.setAttribute('disabled', 'true');
    rtts.length = 0;
    for (let i = 0; i < MAX_PINGS; i++) {
        const ping = new DataView(new ArrayBuffer(PingMessage.size));
        PingMessage.kind.write(ping, MessageKind.Ping);
        PingMessage.timestamp.write(ping, performance.now());
        ws.send(ping);
        await wait(500);
    }
});
ws.addEventListener('message', (event) => {
    if (!(event.data instanceof ArrayBuffer)) {
        console.log('Received message type');
        return;
    }
    const dataView = new DataView(event.data);
    if (PongMessage.validate(dataView)) {
        rtts.push(performance.now() - PongMessage.timestamp.read(dataView));
        pingElement.innerHTML = `<p>Ping: ${rtts.length}</p>`;
        averageRttElement.innerHTML = `<p>Average RTT: ${averageRtt(rtts)}ms</p>`;
        if (rtts.length === MAX_PINGS) {
            startButton.removeAttribute('disabled');
        }
    }
});
const averageRtt = (rtts = []) => (rtts.length === 0 ? 0 : rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(2);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
