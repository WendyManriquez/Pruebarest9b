const mongoose = require('mongoose')
const config = require('./configuracion')

module.exports={
    connecction : null,
    connect : ()=>{
        if(this.connecction) return this.connecction
        return mongoose.connect(config.DB)
        .then(conn =>{
            this.connecction = conn
            console.log('la conexion se realizo de manera correcta');
        })
        .catch(e =>{console.log('error en la conexion' ,e)})
    }
}