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


const schemaProperties = {
        nombre: {type: String, require: true, max: 100},
        nacimiento: {type: String, require: true, max: 100},
        dni: {type: Number, require: true},
        email: {type: String, require: true, max: 100},
        telefono: {type: Number, require: true},
        ciudadnatal: {type: String, require: true, max: 100},
        codigopostal: {type: String, require: true, max: 100},
        contacto: {type: String, require: true, max: 100},
        direccion: {type: String, require: true, max: 100},
        ciudad: {type: String, require: true, max: 100},
        barrio: {type: String, require: true, max: 100},
        rangoprecio: {type: String, require: true, max: 100},
        servicios: {type: String, require: true, max: 100},
        cantidadhuespedes: {type: Number, require: true},
        limpiezatarifa: {type: Number, require: true},
        estadiaminima: {type: Number, require: true},
        estadiamaxima: {type: Number, require: true},
        diasaviso: {type: Number, require: true},
        tiempopreparacion: {type: Number, require: true},
        diasrestringidos: {type: Number, require: true},
        horariocheckin: {type: String, require: true, max: 100},
        horariocheckout: {type: String, require: true, max: 100},
        infomascotas: {type: String, require: true, max: 100},
        infofumar: {type: String, require: true, max: 100},
        infoadicionales: {type: String, require: true, max: 100},
        infowifi: {type: String, require: true, max: 100},
        infopagos: {type: String, require: true, max: 100}
}

const collectionPropertiesSchema = new mongoose.Schema(schemaProperties)
const collectionProperties = mongoose.model("propiedades", collectionPropertiesSchema)
const propiedades = new MongoDb(collectionProperties)


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
const propiedadesInfo = propiedades.getAll()
const consultasInfo =  formularios.getAll()

//Server configuracion
const server = express();
server.set('views', './views'); 
server.set('view engine', 'ejs'); 
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static('./public'))

//Server rutas e inicializacion
server.get('/', async (req, res) => {
    res.render("index", {consultas: await consultasInfo})
})

server.get('/propiedades', async (req, res) => {
    res.render("propiedades", {propiedades: await propiedadesInfo})
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

server.post('/submitProperty', async (req, res) => {
    const property = {
        nombre: req.body.nombre,
        nacimiento: req.body.nacimiento,
        dni: req.body.dni,
        email: req.body.email,
        telefono: req.body.telefono,
        ciudadnatal: req.body.ciudadnatal,
        codigopostal: req.body.codigopostal,
        contacto: req.body.contacto,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
        barrio: req.body.barrio,
        rangoprecio: req.body.rangoprecio,
        servicios: req.body.servicios,
        cantidadhuespedes: req.body.cantidadhuesped,
        limpiezatarifa: req.body.limpiezatarifa,
        estadiaminima: req.body.estadiaminima,
        estadiamaxima: req.body.estadiamaxima,
        diasaviso: req.body.diasaviso,
        tiempopreparacion: req.body.tiempopreparacion,
        diasrestringidos: req.body.diasrestringidos,
        horariocheckin: req.body.horariocheckin,
        horariocheckout: req.body.horariocheckout,
        infomascotas: req.body.infomascotas,
        infofumar: req.body.infofumar,
        infoadicionales: req.body.infoadicionales,
        infowifi: req.body.infowifi,
        infopagos: req.body.infopagos
    }
    await propiedades.save(property)
    res.header("Access-Control-Allow-Origin", "*");
    res.json(property)
})

server.listen(port, async ()=>{
    await initMongoDB()
    console.log(`Server escuchando en puerto ${port}`)
})

