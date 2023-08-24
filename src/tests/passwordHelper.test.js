const assert = require("assert");
const api = require('../api');
const PasswordHelper = require("../helpers/passwordHelper");

let app = {}

const senha = '123'
const senhaGerada = '$2b$04$Sdoe3rgQL8fEuaRBbqSUSed9wcbLUUVDgQeQJ.IsjNa6f25fDFtTW'

describe('User helper, test suite', () => {
    before(async () => {
        app = await api; 
    })

    it('Deve gerar um hash apartir de uma senha', async () => {
        const resultado = await PasswordHelper.hashPassword(senha)
        assert.ok(resultado.length > 10);
    });

    it('Deve validar a nossa senha com um hash', async () => {
        const resultado = await PasswordHelper.comparePassword(senha, senhaGerada)
        assert.ok(resultado);
    });

})