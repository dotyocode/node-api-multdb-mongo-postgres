const assert = require("assert");
const api = require('../api');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvdHlvIiwiaWQiOjEsImlhdCI6MTY5MjM4NjQ0Mn0.4MCnEyrkZl_IJ2TWedYTiVXJFSLxdibW-TgxiUW9D54'
const headers = {
    Authorization: token
}

let app = {}
const HEROI_CADASTRAR = {
    nome: 'Dotyzasso',
    poder: 'Musica - Programacao',
    tipo: 'Android'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Wavenzon',
    poder: 'Dofus mode',
    tipo: 'PCzao'
}

let MOCK_ID = ''

describe('Suite de testes API Heroies', () => {
    before(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        });
        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id; 
    })

    it('Listar rota Herois, /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });

    it('Listar rota /herois, retornando somente 3 registros', async () => {
        const TAMANHO_LIMITE = 2;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.ok(dados.length, TAMANHO_LIMITE);
    })

    it('Listar rota /herois, retornando nome', async () => {
        const TAMANHO_LIMITE = 2;
        const NOME = MOCK_HEROI_INICIAL.nome;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NOME}`,
            headers
        })

        const dados = JSON.parse(result.payload);;
        assert.ok(dados[0].nome === NOME);
    })

    it('Listar cadastrar /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: HEROI_CADASTRAR
        })

        const {message} = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.ok(message === 'Heroi cadastrado com sucesso!');
    })


    it('Atualizar /herois', async () => {
        const _id = MOCK_ID
        console.log(_id)
        const expected = {
            poder: 'Violet'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })

        const dados = JSON.parse(result.payload);
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!');
    })

    
    it('nao deve Atualizar com id incorreto /herois', async () => {
        const _id = `64df916d73b7fa1f3040abde`
        console.log(_id)
        const expected = {
            poder: 'Violet'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })

        const dados = JSON.parse(result.payload);
        assert.deepEqual(dados.message, 'não foi possivel atualizar');
    })

    it('deletar /herois', async () => {
        const _id = MOCK_ID

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const dados = JSON.parse(result.payload);
        assert.deepEqual(dados.message, 'Heroi deletado com sucesso!');
    })


    it('nao deve deletar com id incorreto /herois', async () => {
        const _id = `64df916d73b7fa1f3040abde`

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const dados = JSON.parse(result.payload);
        assert.deepEqual(dados.message, 'não foi possivel deletar');
    })
})