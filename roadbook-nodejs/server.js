const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req,res)=>{
    try {
        const f = await fs.readFile('./test.html');
        res.writeHead(200,{'Content-Type': 'text.html; charset=utf-8'});
        res.end(f);
    } catch (err) {
        console.error(error);
        res.writeHead(500,{'Content-Type': 'text.html; charset=utf-8'});
        res.end(err.message);
    }
})
    .listen(8080,() => {
        console.log('Connecting server from 8080 port...');
    });