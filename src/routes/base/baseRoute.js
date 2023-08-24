class BaseRoute {
    static metodos() { // ele não vai retornar o metodo se estiver com _
        return Object.getOwnPropertyNames(this.prototype).filter(metodo => metodo !== 'constructor' && !metodo.startsWith('_'))
    }
}

module.exports = BaseRoute;