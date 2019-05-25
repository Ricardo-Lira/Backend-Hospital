var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');




/* +

Busqueda por coleccion 


*/

app.get('/coleccion/:tabla/:busqueda',(req, res)=>{

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;


    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuario(busqueda,regex);
        break;

        case 'medicos':
           promesa = buscarMedicos(busqueda,regex);
        break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda,regex);
        break;

        default:

        return res.status(400).send({
            ok: false,
            message: 'Los campos de la busqueda son: Usuarios,Medicos y Hospitales',
            err:{message:'Tipo de Tabla o Coleccion invalida rectifica tu busqueda'}

        });
            
    }


    promesa.then(data =>{

        res.status(200).send({
            ok: true,
            [tabla]: data

        });

    })



})


/* 
Busqueda general: Nos permite buscar en todas las colecciones ya sea en hospitales, medicos o usuarios
Tambien se puede buscar en minusculas y mayusculas, populacion de la informacion para que se muestre
mas completa.

*/

app.get('/todo/:busqueda', (req, res, next)=>{

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuario(busqueda,regex)
    ]).then(respuesta =>{
        
        res.status(200).send({
            ok: true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]

        });
    });

});

function buscarHospitales (busqueda, regex){
    return new Promise((resolve, reject)=>{
        
        Hospital.find({nombre:regex})
                .populate('usuario', 'nombre email')
                .exec((err, hospitales)=>{
    

            if(err) reject('Error al cargar Hospitales');

            resolve(hospitales)
        });
    });    
}

function buscarMedicos (busqueda, regex){
    return new Promise((resolve, reject)=>{
        
        Medico.find({nombre:regex})
              .populate('usuario', 'nombre email')
              .populate('hospital')
              .exec((err, medicos)=>{

            if(err) reject('Error al cargar los Medicos');

            resolve(medicos)
        });
    });    
}


function buscarUsuario (busqueda, regex){
    return new Promise((resolve, reject)=>{
        
        Usuario.find({}, 'nombre email role').or([{'nombre':regex}, {'email': regex}])
                      .exec((err, usuarios)=>{

                        if(err) reject('Error al devolver los usuarios' , err);

                        resolve(usuarios);

                        })

    })   
}








module.exports = app;