//npm install jsonwebtoken

const Joi = require('joi');
const BaseRoute = require("./base/baseRoute");
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper');

const USER = {
    username: 'dotyo',
    password: '12345'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com user e password do banco',
                validate: {
                    payload : {
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                    }
                }
            },
            handler: async (req, head) => {
                try {
                const {username, password} = req.payload;

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })

                if(!usuario) {
                    const response = h.response({ message: 'Usuario informado não existe!' });
                    response.code(401);
                    return response;
                }

                const comparandoSenhas = await PasswordHelper.comparePassword(password, usuario.password);

                if(!comparandoSenhas) {
                    const response = h.response({ message: 'Usuario ou senha invalida!' });
                    response.code(401);
                    return response;
                }


                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret);
                console.log('TOKEN', token)
                return {
                    token
                }
            } catch(err) {
                console.error('você não tem autorização', error);
                return head.response(err).code(401);
            }
            }
        }
    }
}

module.exports = AuthRoutes;