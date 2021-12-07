const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET;

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            '/api/v1/users/login',
            '/api/v1/users/register',
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
        ]
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        //reject the token
        done(null, true)
    }
    done();
}

module.exports = authJwt;