// Requires 

var express = require('express');
var monngose = require('mongoose');


//inicializar variables
var app = express();
var port = 2525;

//conexion a la base de datos

monngose.connection.openUri('mongodb://localhost:27017/HospitalDB',{ useNewUrlParser: true }, (err, res)=>{
    if (err) throw err;
    console.log('Base de Datos \x1b[32m%s\x1b[0m', 'onlinne');
})


//Rutas

app.get('/', (req, res, next)=>{
    res.status(200).send({message: 'Inicio la ruta'})
})


//Escuchar peticiones
app.listen(port, ()=>{
    console.log(`Express corriendo en el puesto: ${port} \x1b[34m%s\x1b[0m`,'onlinne');
})
