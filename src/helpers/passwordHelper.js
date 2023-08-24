const Bcrypt = require('bcrypt');
const {
    promisify
} = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);
const SALT = 3;

class PasswordHelper  {
    static hashPassword(senha) {
        return hashAsync(senha, SALT)
    }

    static comparePassword(senha, hash) {
        return compareAsync(senha, hash)
    }
}

module.exports = PasswordHelper;