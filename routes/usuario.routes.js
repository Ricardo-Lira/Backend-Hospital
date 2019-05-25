var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autentication');


var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

//Obtener los usuarios
app.get('/', (req, res, next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
            .skip(desde)
            .limit(5)
           .exec((err, usuarios)=>{

        if (err) return res.status(500).send({ok: false,message:"Error con la carga de usuarios", errors: err
        });

        Usuario.count({}, (err, conteo)=>{

            res.status(200).send({
                ok: true,
                usuarios,
                total:conteo
            });
        })

    });
   
});




//Actualizar Usuario
app.put('/:id',mdAutenticacion.tokenVerify, (req, res) =>{
    var id =req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario)=>{

        

        if (err) return res.status(500).send({ok: false,message:"Error al buscar el usuario", errors: err});

        if (!usuario) return res.status(400).send({ok:false, message: `El usuario con el id:${id} no existe`, errors:{message:'NO existe un usuario con ese ID'}});

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        


        usuario.save((err, usuarioGuardado) =>{

            if (err) return res.status(400).send({ok: false,message:"Error al actualizar el usuario", errors: err});


            usuarioGuardado.password = undefined;

            res.status(200).send({
                ok: true,
                usuario: usuarioGuardado
        
            });
            

        }); 

        


    });


});

//Creacion de un nuevo usuario
app.post('/',mdAutenticacion.tokenVerify ,(req, res)=>{
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10) ,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado)=>{

        if (err) return res.status(400).send({ok: false,message:"Error al guardar el usuario", errors: err});

        res.status(201).send({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario

        });

    });

});


//Eliminar Usuarios por el id

app.delete('/:id',mdAutenticacion.tokenVerify, (req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if (err) return res.status(500).send({ok: false,message:"Error al borrar el usuario", errors: err});

        if (!usuarioBorrado) return res.status(400).send({ok: false,message:"No hay ningun usuario con ese id", errors: {message: 'NO existe ningun usuario con el id mandado'}});

        res.status(200).send({
            ok: true,
            usuario: usuarioBorrado
    
        });

    });
});




module.exports = app;