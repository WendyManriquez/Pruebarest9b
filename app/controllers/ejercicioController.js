const ejercicioModel = require('../models/EjerciciosModel');


function buscarTodo(req, res) {
    ejercicioModel.find({})
        .then(ejercicios => {
            if (ejercicios.length) {
                return res.status(200).send({ ejercicios });
            }
            return res.status(204).send({ mensaje: "No hay información que mostrar" });
        })
        .catch(e => {
            return res.status(500).send({ mensaje: `Error al buscar la información`, error: e });
        });
}


function guardarEjercicio(req, res) {
    const nuevoEjercicio = new ejercicioModel(req.body);

    nuevoEjercicio.save()
        .then(info => {
            return res.status(201).send({
                mensaje: "Información guardada con éxito",
                ejercicio: info
            });
        })
        .catch(e => {
            return res.status(400).send({
                mensaje: "Error al guardar la información",
                error: e
            });
        });
}


function buscarEjercicio(req, res, next) {
    const consulta = {};
    consulta[req.params.key] = req.params.value;

    ejercicioModel.find(consulta)
        .then(info => {
            if (!info.length) {
                return next(); 
            }
            req.ejercicios = info;
            return next(); 
        })
        .catch(e => {
            req.error = e;
            return next();
        });
}


function mostrarEjercicio(req, res) {
    if (req.error) {
        return res.status(500).send({
            mensaje: "Error al buscar la información",
            error: req.error
        });
    }

    if (!req.ejercicios) {
        return res.status(204).send({ mensaje: "No hay información que mostrar" });
    }

    return res.status(200).send({ ejercicios: req.ejercicios });
}


function eliminarEjercicio(req, res) {
    const consulta = {};
    consulta[req.params.key] = req.params.value;

    ejercicioModel.deleteMany(consulta)
        .then(resultado => {
            if (resultado.deletedCount === 0) {
                return res.status(404).send({
                    mensaje: "No se encontró ningún ejercicio para eliminar"
                });
            }
            return res.status(200).send({
                mensaje: `${resultado.deletedCount} ejercicio eliminado con éxito`
            });
        })
        .catch(error => {
            return res.status(500).send({
                mensaje: "Error al eliminar el ejercicio",
                error: error
            });
        });
}

function actualizarEjercicio(req, res) {
    const filtro = {};
    filtro[req.params.key] = req.params.value;

    ejercicioModel.updateMany(filtro, req.body, { new: true })
        .then(resultado => {
            if (resultado.matchedCount === 0 && resultado.modifiedCount === 0) {
                return res.status(404).send({ mensaje: "No se encontró el ejercicio para actualizar" });
            }
            return res.status(200).send({
                mensaje: "Ejercicio actualizado con éxito",
                resultado
            });
        })
        .catch(error => {
            return res.status(500).send({ mensaje: "Error al actualizar ejercicio", error });
        });
}


module.exports = {
    buscarTodo,
    guardarEjercicio,
    buscarEjercicio,
    mostrarEjercicio,
    eliminarEjercicio,
    actualizarEjercicio 
};
