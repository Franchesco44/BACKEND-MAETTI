const express = require('express');
const mongoose = require('mongoose');
const MongoDb = require('./Contenedores/ContenedorMongoDb.js')
const port = 8080

//Schemas y configuracion mongodb
const schemaFormularios = {
    nombre: {type: String, require: true, max: 100},
    email: {type: String, require: true, max: 100},
    consulta: {type: String, require: true, max: 100},
    telefono: {type: Number, require: true}
}
const collectionFormulariosSchema = new mongoose.Schema(schemaFormularios)
const collectionFormulario = mongoose.model("formularios", collectionFormulariosSchema)
const formularios = new MongoDb(collectionFormulario);


const initMongoDB = async () => {
    const connectAtlas = "mongodb+srv://root:root@cluster0.i61fljc.mongodb.net/cliente?retryWrites=true&w=majority"
    try {
        await mongoose.connect(connectAtlas, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("servidor iniciado mongodb")
    } catch (error) {
        console.log(error)
    }
}

//Server configuracion
const server = express();
server.set('views', './views'); 
server.set('view engine', 'ejs'); 
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static('./public'))

//Server rutas e inicializacion
server.get('/', async (req, res) => {
    const consultas = await formularios.getAll()
    res.render("index", {consultas: consultas})
})

server.post('/submitForm', async (req, res) => {
    const form = {
        nombre: req.body.nombre,
        email: req.body.email,
        consulta: req.body.consulta,
        telefono: req.body.telefono
    }
    await formularios.save(form)
    res.header("Access-Control-Allow-Origin", "*");
    res.send(200)
})

server.listen(port, async ()=>{
    await initMongoDB()
    console.log(`Server escuchando en puerto ${port}`)
})

