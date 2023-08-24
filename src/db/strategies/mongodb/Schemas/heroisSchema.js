//define os Schema

const mongoose = require("mongoose");

    //criando o schema
    const heroiSchema = new mongoose.Schema({
        nome: {
            type: String,
            required: true,
        },
        poder: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        isertedAt: {
            type: Date,
            default: new Date()
        }
    })

module.exports =  mongoose.model('herois', heroiSchema);