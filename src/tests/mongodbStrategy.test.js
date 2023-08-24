const assert = require("assert");
const Context = require('../db/strategies/base/contextstrategy');
const MongoDb = require('../db/strategies/mongodb/mongodb');
const heroiSchema = require('../db/strategies/mongodb/Schemas/heroisSchema');

let context = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Metals',
    poder: 'Metalurgico',
    tipo: 'Metalzao'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Metals',
    poder: 'Metalurgico',
    tipo: 'Metalzao'
}

let MOCK_HEROI_ID = '';

describe('MongoDB Strategy', function () {
    this.timeout(10000); // Aumentando o limite de tempo para 10 segundos

    before(async () => {
        const connection = MongoDb.connect();
        context = new Context(new MongoDb(connection, heroiSchema))
        const result = await context.create(MOCK_HEROI_ATUALIZAR);
        MOCK_HEROI_ID = result._id;
    });    

    it('Mongoose Cadastrar', async () => {
        const { nome, poder, tipo } = await context.create(MOCK_HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder, tipo }, MOCK_HEROI_CADASTRAR);
    });

    it('Mongoose Listar com nome', async () => {
        const [{ nome, poder, tipo }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        const result = {
            nome,
            poder,
            tipo
        };
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar', async () => {
        console.log('MOCK_HEROI_ID', MOCK_HEROI_ID)
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Jhonz'
        });
        assert.deepEqual(result.modifiedCount, 1); // Usar strictEqual para comparação exata
    });

    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ID);
        assert.deepEqual(result.deletedCount, 1);
      });
});
