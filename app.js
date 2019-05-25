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
var loginRoutes  = require('./routes/login.routes');
var hospitalRoutes = require('./routes/hospital.routes');
var medicoRoutes = require('./routes/medico.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var uploadsRoutes = require('./routes/uploads.routes');
var imagnesRoutes = require('./routes/imagenes.routes');


//conexion a la base de datos

monngose.connection.openUri('mongodb://localhost:27017/HospitalDB',{ useNewUrlParser: true }, (err, res)=>{
    if (err) throw err;
    console.log('Base de Datos \x1b[32m%s\x1b[0m', 'onlinne');
})


//Rutas
app.use('/', appRoutes);
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/uploads', uploadsRoutes);
app.use('/img', imagnesRoutes);





//Escuchar peticiones
app.listen(port, ()=>{
    console.log(`Express corriendo en el puesto: ${port} \x1b[34m%s\x1b[0m`,'onlinne');
})
