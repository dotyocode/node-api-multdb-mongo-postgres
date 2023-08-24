const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/contextstrategy');
const MongoDb = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/Schemas/heroisSchema');
const HeroiRoutes = require('./routes/heroRoutes');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const AuthRoutes = require('./routes/authRoutes');
const HapiJwt = require('hapi-auth-jwt2');
const Postgres = require('./db/strategies/postgres/postgres');
const usuarioSchema = require('./db/strategies/postgres/Schemas/usuarioSchema');
const JWT_SCRET = 'MEU_SEGREDAO_123'


const app = Hapi.server({
    port: 4000,
    host: 'localhost'
});


function mapRoutes(instance, matodos) { //responsavel para mapear as rotas
    //tras o nome do projeto
    //metodos tras os nomes
    return matodos.map(metodo => instance[metodo]())
}

const main = async () => {
    //configuração de conexão

    app.validator(Joi);
    //connectando o mongBD
    const conexao = MongoDb.connect();

    //conectando o servidor
    const conectar = new Context(new MongoDb(conexao, HeroiSchema));

    //conecctando Postgres
    const conectarPostgres = await Postgres.connect();
    const usuarioPostgresSchema = await Postgres._defineModelo(conectarPostgres, usuarioSchema);
    const contextPostgres = new Context(new Postgres(conectarPostgres, usuarioPostgresSchema))

    //options do swagger
    const swaggerOptions = {
        info: {
            title: 'API Documentation',
            version: 'v1.0',
        },
    };

    //registrando o swagger
    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SCRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: (dado, req) => {
            //vericando no banco se o usuario continua ativo
            //verifica no banco se o usuario continua pagando
            return {
                isValid: true // deixa passar, caso não vale é falso
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        //adiciona todos os itens da rota sem precisar voltando
        ...mapRoutes(new HeroiRoutes(conectar), HeroiRoutes.metodos()),
        ...mapRoutes(new AuthRoutes(JWT_SCRET, contextPostgres), AuthRoutes.metodos())
    ]
    )

    await app.start();
    console.log('Servidor rodando com sucesso! http://localhost:4000')

    return app;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = main();