import fs from 'fs';
import path from 'path';

var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();

var file = path.resolve(__dirname, env);
console.log(env);
try {
    var config = module.exports = require(file);
    console.log(`Load config: [${env}] ${file}`);
} catch (err) {
    console.error(`Cannot load config: [${env}] ${file}`);
    throw err;
}