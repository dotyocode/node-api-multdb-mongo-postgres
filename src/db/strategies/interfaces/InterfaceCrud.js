//classe customizada para erros
class NotImplementedException extends Error {
    constructor() {
        super("Não foi implementada essa função");
    }
}
//class voltada ao CRUD
class ICrud {
    create(item) {
        throw new NotImplementedException();
    }

    read(query, skip, limit) { //skip e limit é para usar páginação para não vir muita coisa
        throw new NotImplementedException();
    }

    update(id, item) {
        throw new NotImplementedException();
    }

    delete(id) {
        throw new NotImplementedException();
    }

    isConnected() {
        throw new NotImplementedException();
    }

    connect() {
        throw new NotImplementedException();
    }
}

module.exports = ICrud;