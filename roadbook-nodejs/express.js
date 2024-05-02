const express = require('express');
const app = express()

app.set('port', process.env.Port || 8080);

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html',() => next())
});

const myLogger  = function (req, res, next) {
    console.log('Logged');
    next();
};

app.use(myLogger);

app.use(function(err,req,res,next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
})

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), () => {
    console.log('Connecting server from', app.get('port'))
});