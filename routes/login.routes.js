var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;

/* 
Importaciones de google 

*/
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);




//Autenticacion por Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    /* const userid = payload['sub']; */
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return{
        nombre: payload.name,
        email: payload.email,  
        img: payload.picture,     
        google: true,   

    }
  }
  /* verify().catch(console.error); */


app.post('/google', async(req,res)=>{

    var token = req.body.token;
    var googleUser = await verify(token).catch(e=>{

        return res.status(403).send({ok:false, message: 'Token no valido'})

    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioBD)=>{
        if (err) return res.status(500).send({ok: false,message:"Error al Buscar usuarios", errors: err});

        if(usuarioBD){
            if (usuarioBD.google === false) {
                return res.status(400).send({ok: false, message:'Debe de usar su autenticacion normal'})
            }else{

                
                var token = jwt.sign({usuario: usuarioBD}, SEED,{expiresIn:604800});
        
                return res.status(200).send({ok:true, usuario:usuarioBD,token, id:usuarioBD._id})

            }
        }else{
            //Si el usuario no existe a que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioBD)=>{

                var token = jwt.sign({usuario: usuarioBD}, SEED,{expiresIn:604800});

                return res.status(200).send({ok:true, usuario:usuarioBD,token, id:usuarioBD._id})
            })
        }
    });

   


    /* return res.status(200).send({ok:true, message: 'Inicio de la ruta con google sigin',googleUser:googleUser}); */

});


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