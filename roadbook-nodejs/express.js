const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session')

const app = express()

/*port setting*/
app.set('port', process.env.Port || 8080);

/*middleWare*/
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser('secret@1234'));
app.use(session({
    secret: 'secret@1234', //암호화
    resave: false, //새 요청시 세션에 변동사항이 없어도 다시 저장할지 설정
    saveUninitialized: true, //세션에 저장할 내용이 없어도 저장할지 설정
    cookie: { //세션 쿠키 옵션 설정
        httpOnly: true, //자바스크립트 접근금지 기능, 로그인 구현 시 필수 적용
    }
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(function(err,req,res,next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

/*routing*/
app.get('/', function (req, res, next) {
    
    if (req.session.name) {
        const output = `
        <p>Hello, ${req.session.name}.</p>
        `
        res.send(output);
    } else {
        const output = `
        <p>Please login^^</p>
        `
        res.send(output);
    }
    //res.sendFile(__dirname + '/index.html',() => next())
});
app.get('/login', (req, res) => {
    console.log(req.session);
    req.session.name ='roadbook';
    res.end('Login OK');
});
app.get('/logout', (req, res) => {
    res.clearCookie('connect.sid');
    res.end('Logout OK');
});
app.get('/user/:id',(req,res) => {
    res.send(req.params.id +'\'s page..@_@');
})

const myLogger  = function (req, res, next) {
    console.log('Logged');
    next();
};
app.use(myLogger);

/*서버 포트 연결*/
app.listen(app.get('port'), () => {
    console.log('Connecting server from', app.get('port'))
});