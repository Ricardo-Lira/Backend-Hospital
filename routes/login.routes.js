var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;


app.post('/', (req,res)=>{

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioBD)=>{

        if (err) return res.status(500).send({ok: false,message:"Error al Buscar usuarios", errors: err});

        if (!usuarioBD) return res.status(400).send({ok:false, message: `Credenciales Invalidas verifica tus datos`, errors:{message: 'Verifique sus datos'}}
        );

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) 
            return res.status(400).send({ok:false, message: `Credenciales Invalidas `, errors: {message: 'Verifique sus datos'}});
        

        //Creacion del token
        usuarioBD.password = undefined;
        var token = jwt.sign({usuario: usuarioBD}, SEED,{expiresIn:604800});

        return res.status(200).send({ok:true, usuario:usuarioBD,token, id:usuarioBD._id})

    })


})

module.exports = app;