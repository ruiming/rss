import path from 'path'

let env = process.env.NODE_ENV || 'production'
env = env.toLowerCase()

let file = path.resolve(__dirname, env)
console.log(env)
try {
    module.exports = require(file)
    console.log(`Load config: [${env}] ${file}`)
} catch (err) {
    console.error(`Cannot load config: [${env}] ${file}`)
    throw err
}
