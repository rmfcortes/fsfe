const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('Server started on Port 3000'));

/* Begin Websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log('Clientes connected', numClients);
    
    if (ws.readyState === ws.OPEN) {
        wss.broadcast(`Current visitors ${numClients}`);
        ws.send('Welcome to my server');
    }
    
    ws.on('close', () => {
        wss.broadcast(`Current visitors ${numClients}`);
        console.log('A client has disconnected')
    });
});
wss.broadcast = (data) => wss.clients.forEach((client) => client.send(data));
