const Websocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if(req.method === 'GET' && req.url === '/'){

        fs.readFile(path.join(__dirname, 'client/start-page.html'), (err, data) => {

            if(err){

                res.writeHead(500);
                return res.end('Error loading start-page.html');
            }

            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(data);

        });

    }else{

        res.writeHead(404);
        res.end('Page not found');

    }
});

const wss = new Websocket.Server({server});

wss.on('connection', (ws) => {

    console.log('New client connected');

    ws.on('message', (message) => {

        console.log(`Recieved ${message}`);

        // broadcast the message
        wss.clients.forEach(client => {

            if(client.readyState === Websocket.OPEN){

                client.send(message);

            }
        });
    });


    ws.on('close', () => {

        console.log('Client disconnected');

    });
});

server.listen(8080, () => {

    console.log('Server is listening at http://localhost:8080');
})