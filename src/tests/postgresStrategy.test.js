const assert = require("assert"); //validar as variaveis
const Postgres = require('../db/strategies/postgres/postgres');
const Context = require('../db/strategies/base/contextstrategy');
const heroiSchemas = require('../db/strategies/postgres/Schemas/heroiSchema');

let context = {};

const MOCK_HEROI_CADASTRAR = {
    nome: 'Metals',
    poder: 'Metalurgico',
    tipo: 'Metalzao'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Gaudamon',
    poder: 'Sinsitro',
    tipo: 'Lobo'
}

describe('Postgres Strategy', function () {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        const conexao = await Postgres.connect();
        const schema = await Postgres._defineModelo(conexao, heroiSchemas);
        context = new Context(new Postgres(conexao, schema))
        await context.delete();
        await context.create(MOCK_HEROI_ATUALIZAR);
    })
    it('Postgres SQL Connection', async () => {
        const result = await context.isConnected();
        assert.equal(result, true);
    })

    it('Cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR);
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    })

    it('Listar', async () => {
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome});
        delete result.id;
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    })

    it('Atualizar', async () => {
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome});
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Gaudasso'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem);
        const [itemAtualizado] = await context.read({id: itemAtualizar.id})
        assert.deepEqual(result, 1);
        assert.deepEqual(itemAtualizado.nome, novoItem.nome);
    })

    it('remover', async () => {
        const [item] = await context.read({});
        const result = await context.delete(item.id);
        assert.deepEqual(result, 1);

    })
})