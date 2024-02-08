const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const { execute } = require('../../utils/dbConnect');
const { sendResponse } = require('../../utils/sendResponse');
const { CustomError } = require('../../middlewares/errorMiddleware');

const _getUser = () => `
    SELECT 
        uid, isActive
    FROM
        users
    WHERE
        uid = ? and uemail = ?
`

const loginUser = asyncHandler( async (req, res) => {
    const { uid, uemail } = req.body;

    if(!uid || !uemail) {
        throw new CustomError('Provide user id and user email.', 400);
    }

    const queryData = [uid, uemail]

    const resultArr = await execute(_getUser(), queryData);

    if(!(resultArr.length)) {
        throw new CustomError('Invalid credentials.', 404);
    }

    if(!(resultArr[0].isActive)) {
        throw new CustomError('User account has been deactivated.', 404)
    }

    const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return sendResponse(
        res,
        {message: 'User logged in and token sent', token},
        200
    );

})

module.exports = { loginUser };