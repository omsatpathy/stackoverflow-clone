const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect =  asyncHandler( async (req, res, next) => {
    let token = req.headers.authorization

    if(!token) {
        res.status(401);
        throw new Error('Not authorized.');
    }

    token = token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch(error) {
        res.status(401);
        throw new Error('Not authorized, invalid token.');
    } 
});

module.exports = { protect };