var express = require('express');
var app = express();

var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autentication');



//Obtener los Medicos
app.get('/', (req, res, )=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
          .skip(desde)
          .limit(5)
          .populate('usuario', 'nombre email')
          .populate('hospital')
          .exec((err, medicos)=>{

        if (err) return res.status(500).send({ok: false,message:"Error con la carga de los Medicos", errors: err
        });


    Medico.count({},(err, conteo)=>{

        res.status(200).send({
            ok: true,
            medicos,
            total: conteo
        });
    });
    });
   
});


//Actualizar medico
app.put('/:id',mdAutenticacion.tokenVerify, (req, res) =>{
    var id =req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico)=>{

        

        if (err) return res.status(500).send({ok: false,message:"Error al buscar el medico", errors: err});

        if (!medico) return res.status(400).send({ok:false, message: `El medico con el id:${id} no existe`, errors:{message:'NO existe un medico con ese ID'}});

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        


        medico.save((err, medicoGuardado) =>{

            if (err) return res.status(400).send({ok: false,message:"Error al actualizar el medico", errors: err});

            res.status(200).send({
                ok: true,
                medico: medicoGuardado
        
            });
            

        }); 

        


    });


});

//Creacion de un nuevo medico
app.post('/',mdAutenticacion.tokenVerify ,(req, res)=>{
    var body = req.body;

    var medico = new Medico({

        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado)=>{

        if (err) return res.status(400).send({ok: false,message:"Error al guardar el medico", errors: err});

        res.status(201).send({
            ok: true,
            medico: medicoGuardado,

        });

    });

});


//Eliminar medico por el id

app.delete('/:id',mdAutenticacion.tokenVerify, (req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{

        if (err) return res.status(500).send({ok: false,message:"Error al borrar el medico", errors: err});

        if (!medicoBorrado) return res.status(400).send({ok: false,message:"No hay ningun medico con ese id", errors: {message: 'NO existe ningun medico con el id mandado'}});

        res.status(200).send({
            ok: true,
            medico: medicoBorrado
    
        });

    });
});


module.exports = app;