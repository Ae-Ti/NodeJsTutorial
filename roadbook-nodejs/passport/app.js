const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;

const app = express();

app.set('port', process.env.PORT || 8080);

let fakeUser = {
    username: 'test@test.com',
    password: 'test@1234'
}

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser('passportExample'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'passportExample',
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function (id, done){
    console.log('deserializeUser', id);
    done(null,fakeUser);
});

passport.use(new Localstrategy(
    function (username, password, done) {
        if (username === fakeUser.username) {
            if (password === fakeUser.password) {
                return done(null, fakeUser);
            } else{
                return done(null,false, {message: "password incorrect"});
            }
        } else {
            return done(null, false, {message: "username incorrect"});
        }
    }
));

app.get('/', (req,res) => {
    if(!req.user) {
        res.sendFile(__dirname + '/index.html');
    } else {
        const user = req.user.username;
        const html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>${user}님 안녕하세요!</p>
            <button type="button" onclick="location.href='/logout'">Log Out</button>
        </body>
        </html>
        `
        res.send(html);
    }
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/'}),
    function(req, res) {
        res.send('Login sucess')
    });

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error Occured');
})

app.listen(app.get('port'), () => {
    console.log('connect server from',app.get('port'));
});