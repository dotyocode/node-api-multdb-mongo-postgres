const ICrud = require("../interfaces/InterfaceCrud");
// Importando os módulos necessários
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor(conexao, schema) {
        super();
        this._conexao = conexao; // configuração do sequilize
        this._schema = schema; //base de dados
    }

    async isConnected() {
        try {
            await this._conexao.authenticate();
            return true;
        } catch (error) {
            console.log('Falhou sua conexão', error);
            return false;
        }
    }

    static async _defineModelo(conexao, schema) {
        const modelo = conexao.define(
            schema.name, schema.schema, schema.options //acessando os objetos que estão dentro da pasta schema
        )
        // sincronizando modelo
        await modelo.sync();
        return modelo
    }

    static async connect() {
        // Criando a conexão com o banco de dados
        const conection = new Sequelize(
            'heroes', // nome do banco
            'dotyo', // usuario
            'minhasenhasecreta', // senha
            {
                host: 'localhost',
                dialect: 'postgres', // tipo do conexao (tipo do banco)
                quoteIdentifiers: false,  // identificadores, não case sensitive por ai vai
                operatorsAliases: false, // Deve ser "operatorsAliases" em vez de "operatorAliases" evitar metodos invalidos
                logging: false
            });
        return conection
    }

    async create(item) {
        const { dataValues } = await this._schema.create(item);
        return dataValues;
    }

    async read(item = {}) {
        return await this._schema.findAll({ where: item, raw: true });
    }

    async update(id, item, seNaoTiverItem=false) {
        const updateOuUpsert = seNaoTiverItem ? 'upsert' : 'update'
        return await this._schema[updateOuUpsert](item, { where: { id: id } });
    }

    async delete(id) {
        const query = id ? { id } : {}
        return await this._schema.destroy({ where: query });
    }
}

module.exports = Postgres;