const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => console.log('Server started on Port 3000'));

process.on('SIGINT', () => {
    wss.clients.forEach(client => client.close());
    server.close(() => shutdownDB());
});

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

    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
    `);
    
    ws.on('close', () => {
        console.log('A client has disconnected')
    });
});
wss.broadcast = (data) => wss.clients.forEach((client) => client.send(data));

/* End Websocket */

/* Begin database */
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `)
});

function getCounts() {
    db.each('SELECT * FROM visitors', (err, row) => {
        console.log('Row', row);
    });
}

function shutdownDB() {
    getCounts();
    console.log('Shutting down DB');
    db.close();
}