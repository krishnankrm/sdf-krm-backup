const expressJwt = require('express-jwt');
const config = {
    "secret": "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
}


module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/users/authenticate'
        ]
    });
}
