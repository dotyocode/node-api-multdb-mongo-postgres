const ICrud = require("../interfaces/InterfaceCrud");
const mongoose = require('mongoose');

const STATUS = {
    0: 'Desconectado',
    1: 'Conectando',
    2: 'Conectado',
    3: 'Desconectando',
    99: 'Erro de Conexão'
}

class MongoDB extends ICrud {
    constructor(conexao, schema) {
        super();
        this._schema = schema;
        this._conexao = conexao;
    }

    async isConnected() {
        return new Promise((resolve, reject) => {
            const estagioConectado = STATUS[2];
            const estagioConectando = STATUS[1];

            const checandoConexão = () => {
                const state = STATUS[this._conexao.readyState];
                if (state === estagioConectado) {
                    resolve(state);
                } else if (state === estagioConectando) {
                    setTimeout(checandoConexão, 1000); // Refaz em 1 segundo
                } else {
                    reject(new Error(`Houve um erro na conexão: ${state}`));
                }
            };
            checandoConexão();
        });
    }

    static connect() {
        return new Promise((resolve, reject) => {
            const connection = mongoose.connection;
            
            connection.once('open', () => {
                console.log('Database rodando!');
                this._conexao = connection;
                resolve(); // Resolve a Promise após a conexão ser estabelecida
            });
    
            connection.on('error', (error) => {
                console.error('Erro na conexão:', error);
                reject(error); // Rejeita a Promise em caso de erro
            });
    
            mongoose.connect('mongodb://dotyo:minhaSenhaSecreta@localhost:27017/herois', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        });
    }

    async create(item) {
            try {
                const result = await this._schema.create({
                    nome: item.nome,
                    poder: item.poder,
                    tipo: item.tipo
                });
                console.log('Item cadastrado com sucesso:', result);
                return result; // Retorna o resultado da criação
            } catch (error) {
                console.error('Houve um erro ao cadastrar o item', error);
                throw error; // Lança o erro para tratamento externo, se necessário
            }
    }

    async read(item, skip = 0, limit = 10) {

        try {
            const listItens = await this._schema.find(item).skip(skip).limit(limit)
            console.log(listItens)
            return listItens;

        } catch (error) {
            console.error('Erro ao buscar item:', error);
            throw error;
        }
    }

     update(id, item) {
        return this._schema.updateOne({_id: id}, {$set: item});
    }


    async delete(id) {
        console.log('id', id)
        return await this._schema.deleteOne({_id: id});  
    }


}

module.exports = MongoDB;