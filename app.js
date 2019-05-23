// Requires 

var express = require('express');
var monngose = require('mongoose');
var bodyParser = require('body-parser');



//inicializar variables
var app = express();
var port = 2525;

//body-Parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//importar rutas
var appRoutes = require('./routes/app.routes');
var usuarioRoutes  =require('./routes/usuario.routes');
var loginRoutes  =require('./routes/login.routes');

//conexion a la base de datos

monngose.connection.openUri('mongodb://localhost:27017/HospitalDB',{ useNewUrlParser: true }, (err, res)=>{
    if (err) throw err;
    console.log('Base de Datos \x1b[32m%s\x1b[0m', 'onlinne');
})


//Rutas
app.use('/', appRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);




//Escuchar peticiones
app.listen(port, ()=>{
    console.log(`Express corriendo en el puesto: ${port} \x1b[34m%s\x1b[0m`,'onlinne');
})
