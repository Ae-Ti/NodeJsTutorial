const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session')

const app = express()

/*port setting*/
app.set('port', process.env.Port || 8080);

/*middleWare*/
app.use(express.static(__dirname + '/public')); //static 파일 연결
app.use(morgan('dev')); //logger api, request와 response를 포매팅해 콘솔 로그 찍음
app.use(cookieParser('secret@1234'));
app.use(session({
    secret: 'secret@1234', //암호화
    resave: false, //새 요청시 세션에 변동사항이 없어도 다시 저장할지 설정
    saveUninitialized: true, //세션에 저장할 내용이 없어도 저장할지 설정
    cookie: { //세션 쿠키 옵션 설정
        httpOnly: true, //자바스크립트 접근금지 기능, 로그인 구현 시 필수 적용
    }
}))
app.use(express.json()); //요청정보 파싱 및 req.body로 접근 가능(req.body가 json 형태일 때)
app.use(express.urlencoded({extended: true})); //요청정보 파싱 및 req.body로 접근 가능(req.body가 폼에 대한 요청 형태일 때)
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