import fs from 'fs';

var publicKey = fs.readFileSync('config/id_rsa.pub');
var privateKey = fs.readFileSync('config/id_rsa');

module.exports = {
    PORT: 3000,
    MongoDB: {
        PORT: 27017,
        HOST: "localhost",
        USER: "root",
        PASSWORD: "root",
        NAME: "rss"
    },
    app: {
        secretKey: publicKey
    }
}
