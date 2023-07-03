import jwt from 'jsonwebtoken';

const generateJWT = (userName: string) => {
    return new Promise((resolve, reject) => {
        const payload = { userName };

        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: '2h' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
}

export default generateJWT;
