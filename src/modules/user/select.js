const { execute } = require('../../utils/dbConnect')
const ayncHandler = require('express-async-handler')
const { sendResponse } = require('../../utils/sendResponse')

const _getUser = () => `
    SELECT 
        uemail as userEmail,
        uname as userName
    FROM
        users
    WHERE
        uid = ?;
`

const getUser = ayncHandler(async (req, res) => {
    const { uid } = req.user;

    const queryData = [uid];

    const userData = await execute(_getUser(), queryData);

    return sendResponse(
        res,
        userData,
        200
    )

});

module.exports = { getUser };