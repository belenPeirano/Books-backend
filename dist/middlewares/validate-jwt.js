"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../index"));
const validateJWT = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    index_1.default.blackListedTokens.forEach(blackListToken => {
        if (blackListToken === token) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
    });
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || '');
        const userName = payload.userName;
        if (!userName) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
        // go to next function
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};
exports.default = validateJWT;
//# sourceMappingURL=validate-jwt.js.map