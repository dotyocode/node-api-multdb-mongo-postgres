const Joi = require('joi');

const BaseRoute = require("./base/baseRoute");
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroiRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Deve listar um ou mais herois',
                notes: 'Pode listar um heroi ou mais e a quantidade tbm',
                validate: {
                    failAction: (req, head, err) => {
                        throw err;
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers
                }
            },
            handler: async (req, h) => {
                try {
                    const { skip, limit, nome } = req.query;
                    const query = nome ? { nome: { $regex: new RegExp(nome, 'i') } } : {};

                    return this.db.read(query, parseInt(skip), parseInt(limit));
                } catch (error) {
                    console.error(error);
                    return h.response(error).code(500);
                }
            }
        };
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastra um heroi',
                notes: 'Pode cadastrar um heroi passando nome, poder e tipo',
                validate: {
                    failAction: (req, head, err) => {
                        throw err;
                    },
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(50),
                        tipo: Joi.string().required().min(3).max(50),
                    }
                }
            },
            handler: async (req, h) => {
                try {
                    const { nome, poder, tipo } = req.payload;
                    const resultado = await this.db.create({ nome, poder, tipo })
                    console.log(resultado)
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: resultado._id
                    }
                } catch (err) {
                    console.error('Falha ao cadastras usuario', err)
                    return 'Error interno'
                }
            }
        }
    }

    update() {
        return {
            path: `/herois/{id}`,
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar um heroi',
                notes: 'Pode atualizar algum parametro ou mais de um heroi',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(50),
                        tipo: Joi.string().min(3).max(500)
                    }
                }
            },
            handler: async (req, h) => {
                try {
                    const { id } = req.params;
                    const { payload } = req;
                    const dadosString = JSON.stringify(payload);
                    const dados = JSON.parse(dadosString); // aqui vai ser os dados para serem alterados

                    const result = await this.db.update(id, dados)

                    
                    if (result.modifiedCount !== 1) {
                        const response = h.response({ message: 'não foi possivel atualizar' });
                        response.code(500);
                        return response;
                    }
 

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }

                } catch (error) {
                    console.error(error);
                    return h.response(error).code(500);
                }
            }
        };
    }

    delete() {
        return {
            path: `/herois/{id}`,
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve deletar um herois',
                notes: 'Pode delar um heroi apartir de seu ID',
                validate: {
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (req, h) => {
                try {
                    const { id } = req.params;

                    const result = await this.db.delete(id)

                    if (result.deletedCount !== 1) {
                        const response = h.response({ message: 'não foi possivel deletar' });
                        response.code(500);
                        return response;
                    }                    

                    return {
                        message: 'Heroi deletado com sucesso!'
                    }

                } catch (error) {
                    console.error(error);
                    return h.response(error).code(500);
                }
            }
        };
    }

}

module.exports = HeroiRoutes;