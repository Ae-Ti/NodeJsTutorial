const express = require('express');
const app = express()

app.set('port', process.env.Port || 8080);

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(app.get('port'), () => {
    console.log('Connecting server from', app.get('port'))
});