class MongoDb {
    constructor(collection){
        this.collections = collection
    }

    async save(objeto){
        const saveObjModel = new this.collections(objeto)
        const save = await saveObjModel.save()
    }

    async getAll(){
        const listaElementos = await this.collections.find();
        return listaElementos
    }

    async deleteById(id){
        const eliminarElemento = await this.collections.deleteOne({_id: id})
    } 

    async deleteAll(){
        const eliminarElementos = await this.collections.deleteMany()
    }
}

module.exports = MongoDb