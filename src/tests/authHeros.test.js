const assert = require("assert");
const api = require('../api');
const Context = require('../db/strategies/base/contextstrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const usuarioSchema = require("../db/strategies/postgres/Schemas/usuarioSchema");

let app = {}
const user = {
    username: 'dotyo',
    password: '123'
}

const userdb = {
    ...user,
    password: '$2b$04$w4uNXgq4SlamfVQqT0mqMucXVam/EM8FdH9uoAOTBF2IITJBNNZS6'
}

describe('Auth test suite', () => {
    before(async () => {
        app = await api; 
        const conexaoPostgres = await Postgres.connect(); // conectando com banco
        const modelo = await Postgres._defineModelo(conexaoPostgres, usuarioSchema); // modelo recebendo o schema
        await modelo.update(null, userdb, true)
    })

    it('Deve obter um token', async () => {
        const resultado = await app.inject({
            method: 'POST',
            url: '/login',
            payload: user
        })

        const statusCode = resultado.statusCode;
        const dados = JSON.parse(resultado.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.token.length > 10);
    });

})