const asyncHandler = require('express-async-handler')
const { execute } = require('../../utils/dbConnect');
const { sendResponse } = require('../../utils/sendResponse');
const  { CustomError } = require('../../middlewares/errorMiddleware')

const _getUserActiveStatus = () => `
    SELECT 
        isActive
    FROM
        users
    WHERE
        uid = ?
`

const _setUserAsNotActive = () => `
    UPDATE
        users
    SET
        isActive = 0
    WHERE uid = ?
`

const deleteUser = asyncHandler( async (req, res) => {
    const { uid } = req.user;

    const queryData = [uid];

    const userActiveStatus = await execute(_getUserActiveStatus(), queryData);

    if(!(userActiveStatus[0].isActive)) {
        throw new CustomError("User already deactivated.", 401);
    }

    const resultArr = await execute(_setUserAsNotActive(), queryData);

    return sendResponse(
        res,
        { message: 'User succesfully deleted.' },
        200
    )

})

module.exports = { deleteUser };