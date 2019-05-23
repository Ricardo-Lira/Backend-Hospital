var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

//Verificacion del token con un midellware

exports.tokenVerify = function (req, res, next){
    
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded)=>{
        if (err) return res.status(401).send({ok: false,message:"Token incorrecto", errors: err});
        
        req.usuario = decoded.usuario;
        
        next();
/* 
      res.status(200).send({
        ok: true,
        decoded: decoded
        }); */
    });
}






