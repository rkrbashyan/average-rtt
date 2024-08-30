import { WS_PORT } from './settings.js';
import { PingMessage, PongMessage, MessageKind } from './shared.js';

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.hostname}:${WS_PORT}`);

ws.binaryType = 'arraybuffer';

const startButton = document.getElementById('start') as HTMLButtonElement;
const pingElement = document.getElementById('ping') as HTMLPreElement;
const averageRttElement = document.getElementById('average-rtt') as HTMLPreElement;

const rtts: number[] = [];
const MAX_PINGS = 20;

/* 
// First attempt
startButton.addEventListener('click', async () => {
  startButton.setAttribute('disabled', 'true');
  rtts.length = 0;

  for (let i = 0; i < MAX_PINGS; i++) {
    const ping = performance.now();
    ws.send(`${ping}`);
    await wait(500);
  }
});

ws.addEventListener('message', (event) => {
  const timeStamp = event.data;
  rtts.push(performance.now() - timeStamp);
  pingElement.innerHTML = `<p>Ping: ${rtts.length}</p>`;
  averageRttElement.innerHTML = `<p>Average RTT: ${averageRtt(rtts)}ms</p>`;

  if (rtts.length === MAX_PINGS) {
    startButton.removeAttribute('disabled');
  }
}); */

/* 
// Second attempt
startButton.addEventListener('click', async () => {
  startButton.setAttribute('disabled', 'true');
  rtts.length = 0;

  for (let i = 0; i < MAX_PINGS; i++) {
    const ping = new DataView(new ArrayBuffer(4));
    ping.setFloat32(0, performance.now());
    ws.send(ping);
    await wait(500);
  }
});

ws.addEventListener('message', (event) => {
  const timeStamp = new DataView(event.data).getFloat32(0);
  rtts.push(performance.now() - timeStamp);
  pingElement.innerHTML = `<p>Ping: ${rtts.length}</p>`;
  averageRttElement.innerHTML = `<p>Average RTT: ${averageRtt(rtts)}ms</p>`;

  if (rtts.length === MAX_PINGS) {
    startButton.removeAttribute('disabled');
  }
}); */

/* 
// Third attempt
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
    console.log('Received non-ArrayBuffer message');
    return;
  }

  const pong = new DataView(event.data);
  rtts.push(performance.now() - PongMessage.timestamp.read(pong));
  pingElement.innerHTML = `<p>Ping: ${rtts.length}</p>`;
  averageRttElement.innerHTML = `<p>Average RTT: ${averageRtt(rtts)}ms</p>`;

  if (rtts.length === MAX_PINGS) {
    startButton.removeAttribute('disabled');
  }
}); */

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

const averageRtt = (rtts: number[] = []): string =>
  (rtts.length === 0 ? 0 : rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(2);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
