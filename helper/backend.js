import jwt from 'jsonwebtoken';
import config from '../config/config';

exports.checkJwt = async (jwt) => {
    let msg = await jwt.verify(token, config.app.secretKey);
    return msg;
}