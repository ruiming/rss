import path from 'path'

let env = process.env.NODE_ENV || 'production'
env = env.toLowerCase()

const file = path.resolve(__dirname, env)
console.log(env)
try {
  /* eslint-disable */
  module.exports = require(file)
  /* eslint-enable */
  console.log(`Load config: [${env}] ${file}`)
} catch (err) {
  console.error(`Cannot load config: [${env}] ${file}`)
  throw err
}
