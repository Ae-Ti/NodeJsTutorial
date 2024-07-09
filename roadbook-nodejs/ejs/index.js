const path = require('path');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 8080);
app.set('views', __dirname +'/views');
app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    res.render('index', {
        "People":
        [
            {
                "name": "gildong",
                "age": "15"
            },
            {
                "name": "Jinsu",
                "age":"27"
            },
            {
                "name":"Hyena",
                "age":"25"
            }
        ]
        , title: "Express"
    });
});

app.listen(app.get('port'),()=>{
    console.log('Connect server from'+8080);
});