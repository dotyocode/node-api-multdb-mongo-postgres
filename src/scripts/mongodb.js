for (let index = 0; index < 10000; index++) {
    db.herois.insert({ nome: `Clone-${index}`, poder: 'Suprema Bola de fogo', tipo: 'Reptil', dataNascimento: '1995-18-01' })
}