var express = require('express');
var app = express();


app.get('/', (req, res, next)=>{
    res.status(200).send({
        ok: true,
        message: 'Inicio la ruta'})
})



module.exports = app;