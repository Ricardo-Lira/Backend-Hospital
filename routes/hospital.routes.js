var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autentication');





//Obtener los Hospitales
app.get('/', (req, res, )=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=>{

        if (err) return res.status(500).send({ok: false,message:"Error con la carga de los hospitales", errors: err
        });



        Hospital.count({}, (err, conteo)=>{

            res.status(200).send({
                ok: true,
                hospitales,
                total:conteo
            });
        })

    });
   
});


//Actualizar Hospital
app.put('/:id',mdAutenticacion.tokenVerify, (req, res) =>{
    var id =req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital)=>{

        

        if (err) return res.status(500).send({ok: false,message:"Error al buscar el hospital", errors: err});

        if (!hospital) return res.status(400).send({ok:false, message: `El hospital con el id:${id} no existe`, errors:{message:'NO existe un hospital con ese ID'}});

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        


        hospital.save((err, hospitalGuardado) =>{

            if (err) return res.status(400).send({ok: false,message:"Error al actualizar el Hospital", errors: err});

            res.status(200).send({
                ok: true,
                hospital: hospitalGuardado
        
            });
            

        }); 

        


    });


});

//Creacion de un nuevo hospital
app.post('/',mdAutenticacion.tokenVerify ,(req, res)=>{
    var body = req.body;

    var hospital = new Hospital({

        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado)=>{

        if (err) return res.status(400).send({ok: false,message:"Error al guardar el Hospital", errors: err});

        res.status(201).send({
            ok: true,
            hospital: hospitalGuardado,

        });

    });

});


//Eliminar Hospital por el id

app.delete('/:id',mdAutenticacion.tokenVerify, (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{

        if (err) return res.status(500).send({ok: false,message:"Error al borrar el Hospital", errors: err});

        if (!hospitalBorrado) return res.status(400).send({ok: false,message:"No hay ningun hospital con ese id", errors: {message: 'NO existe ningun Hospital con el id mandado'}});

        res.status(200).send({
            ok: true,
            hospital: hospitalBorrado
    
        });

    });
});



module.exports = app;