const http = require('http');

const session = {};
const sessKey = 'new_key';
session[sessKey] = {name: 'roadbook'};

http.createServer((req,res) => {
    res.writeHead(200,{'Set-cookie': `session=${sessKey}`});
    res.end('Session-Cookie --> Header');
})
    .listen(8080,() => {
        console.log('Connecting server from 8080');
    })