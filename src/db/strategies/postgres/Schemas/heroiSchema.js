const Sequelize = require('sequelize');
const heroiSchemaPostgres = {
    name: 'herois',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false, // Deve ser "allowNull" em vez de "required"
        },
        poder: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    options: {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false, // Deve ser "timestamps" em vez de "timeStamps"
    }
}

module.exports = heroiSchemaPostgres;