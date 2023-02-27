const express = require('express');
const mongoose = require('mongoose');
const MongoDb = require('./Contenedores/ContenedorMongoDb.js')
const port = 8080
const multer = require('multer')



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

const schemaPropiedadesSubidas = {
    titulo: {type: String, require: true, max: 100},
    precio: {type: Number, require: true},
    url: {type: String, require: true, max: 100},
    imagen: {type: String, require: true, max: 100},
    alquiler: {type: String, require: true, max: 100},
    ubicacion: {type: String, require: true, max: 100}
}

const collectionPropiedadesSubidasSchema = new mongoose.Schema(schemaPropiedadesSubidas)
const collectionPropiedadesSubidas = mongoose.model("propiedades_subidas", collectionPropiedadesSubidasSchema)
const propiedadesSubidas = new MongoDb(collectionPropiedadesSubidas)

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

const storage = multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

//Multer
server.use(multer({
    storage,
    dest: './public'
}).single('imagenPropiedad'))
const upload = multer({storage: storage})

server.set('views', './views'); 
server.set('view engine', 'ejs'); 
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static('./public'))

//Server rutas e inicializacion
server.get('/', async (req, res) => {
    const consultasInfo =  await formularios.getAll()
    res.render("index", {consultas: consultasInfo})
})

server.get('/propiedades', async (req, res) => {
    const propiedadesInfo = await propiedades.getAll()
    res.render("propiedades", {propiedades: propiedadesInfo})
})  

server.get('/formulariopropiedad', (req, res) => {
    res.render("formulariopropiedad")
})  

server.get('/propiedadesSubidas', async (req, res) => {
    const propiedadesSubidasInfo = await propiedadesSubidas.getAll()
    res.header("Access-Control-Allow-Origin", "*");
    res.json(propiedadesSubidasInfo)
})

server.post('/subirPropiedad', async (req, res) => {
    const propiedad = {
        titulo: req.body.titulo,
        precio: req.body.precio,
        url: req.body.url,
        imagen: req.file.originalname,
        alquiler: req.body.alquiler,
        ubicacion: req.body.ubicacion
    }
    res.header("Access-Control-Allow-Origin", "*");
    await propiedadesSubidas.save(propiedad)
    res.send(propiedad)
})

server.post('/submitForm', async (req, res) => {
    const form = {
        nombre: req.body.nombre,
        email: req.body.email,
        consulta: req.body.consulta,
        telefono: req.body.telefono,
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

