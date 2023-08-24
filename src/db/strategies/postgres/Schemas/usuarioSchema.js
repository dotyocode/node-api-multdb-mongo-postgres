const Sequelize = require('sequelize');
const usuarioSchema = {
    name: 'usuarios',
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
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    options: {
        tableName: 'TB_USUARIOS',
        freezeTableName: false,
        timestamps: false, // Deve ser "timestamps" em vez de "timeStamps"
    }
}

module.exports = usuarioSchema;