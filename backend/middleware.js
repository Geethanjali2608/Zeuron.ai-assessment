const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Ideally, this should be stored in an environment variable

const authenticateToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = authenticateToken;
