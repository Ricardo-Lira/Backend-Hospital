var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
// default options
app.use(fileUpload());

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.put('/:tipo/:id', (req, res, next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Verificacion del tipo de coleccion a la que pertenece la imagen

    var colecciones =['hospitales','medicos', 'usuarios'];
    if(colecciones.indexOf(tipo) < 0) return res.status(400)
                                                .send({ok:false,
                                                       message: 'Tipo de coleecion no valida',
                                                       errors: {message:'Las colecciones validas son Medicos, Usuarios y Hospitales'}})

    if(!req.files) return res.status(400).send({
        ok: false,
        message: 'Error no se encuentra ningun archivo',
        errors: {message: 'Seleccione un archivo'}
    });

    //Obtener la informacion del archivo

    var archivo = req.files.imagen;
    var ruta  = archivo.name.split('.');
    var extencion = ruta[ruta.length -1];


    //Validando las extenciones de archivos
    var extenciones = ['png', 'jpg', 'gif', 'jpeg'];

    if(extenciones.indexOf(extencion) < 0) return  res.status(400).send({
        ok: false,
        message: 'Error no Es valida la extencion',
        errors: {message: `Seleccione un archivo con extencion valida ${extenciones.join(', ')}`}
    });


    //Nombre personalizado del archivo

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    //Mover el archivo del temporal al path
    var path = `./uploads/${tipo }/${nombreArchivo}`;
    archivo.mv(path, err =>{
        if (err)return res.status(500).send({ok:false,
                                            message:'Error al mover el archivo',
                                             err});



    })
    SubirPorTipo(tipo, id, nombreArchivo, res);


 /*    res.status(200).send({
        ok: true,
        message: 'Peticion realizada corectamente',
        extencion
    }) */
})



function SubirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario)=>{

            if(!usuario) return res.status(400).send({
                ok: false,
                message: 'Error no se encuentra ningun Usuario con ese Id',
                errors: {message: 'Usuario no existe'}
            });

            var pathViejo = './uploads/usuarios/' + usuario.img;
    
            //elimina la  imagen vieja del paht
            if(fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
    
            usuario.img = nombreArchivo; 
            usuario.save((err, usuarioActualizado)=>{
            usuarioActualizado.password = undefined;

            
    
              return  res.status(200).send({
                    ok: true,
                    message: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
    
                })
    
            })
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico)=>{

            if(!medico) return res.status(400).send({
                ok: false,
                message: 'Error no se encuentra ningun Medico con ese Id',
                errors: {message: 'Medico no existe'}
            });

            var pathViejo = './uploads/medicos/' + medico.img;
    
            //elimina la  imagen vieja del paht
            if(fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
    
            medico.img = nombreArchivo; 
            medico.save((err, medicoActualizado)=>{

            
    
              return  res.status(200).send({
                    ok: true,
                    message: 'imagen de medico actualizada',
                    medico: medicoActualizado
    
    
                })
    
            })
        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital)=>{

            if(!hospital) return res.status(400).send({
                ok: false,
                message: 'Error no se encuentra ningun Hospital con ese Id',
                errors: {message: 'Hospital no existe'}
            });

            var pathViejo = './uploads/hospitales/' + hospital.img;
    
            //elimina la  imagen vieja del paht
            if(fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
    
            hospital.img = nombreArchivo; 
            hospital.save((err, hospitalActualizado)=>{

            
    
              return  res.status(200).send({
                    ok: true,
                    message: 'imagen de hospital actualizada',
                    hospital: hospitalActualizado
    
    
                })
    
            })
        });
    }

}



module.exports = app;