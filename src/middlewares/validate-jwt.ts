import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('autorization');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY || '') as JwtPayload;
        const userName = payload.userName;
        if (!userName) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
        // go to next function
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

export default validateJWT;
