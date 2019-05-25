var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');


app.get('/:tipo/:img', (req, res, next)=>{

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) res.sendFile(pathImagen);

    var pathNoImage = path.resolve(__dirname, '../assets/defect.jpg');
    res.sendFile(pathNoImage);
});


module.exports = app;