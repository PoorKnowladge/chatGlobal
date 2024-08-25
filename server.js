const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (data) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === 'message') {
            // Broadcast pesan ke semua klien yang terhubung
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedData));
                }
            });
        } else if (parsedData.type === 'username') {
            // Broadcast pesan username baru ke semua klien yang terhubung
            const joinMessage = {
                type: 'username',
                username: parsedData.username
            };
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(joinMessage));
                }
            });
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:3000');
