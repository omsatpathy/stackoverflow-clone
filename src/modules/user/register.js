const { execute } = require('../../utils/dbConnect')
const asyncHandler = require('express-async-handler');
const { sendResponse } = require('../../utils/sendResponse');

const _insertUser = () => `
    INSERT INTO users (uid, uemail, uname)
    VALUES (?)
`

const registerUser = asyncHandler(async (req, res) => {
    const { uid, uemail, uname } = req.body;

    const queryData = [uid, uemail, uname];

    const registeredUserDetails = await execute(_insertUser(), [queryData]);

    // if(resultArr instanceof Error) {

    //     const isActiveCheckQuery = `select isActive from users where uid = '${uid}'`;
    //     const isActiveCheckArr = await execute(isActiveCheckQuery);
        
    //     if(isActiveCheckArr instanceof Error) {
    //         res.status(400);
    //         throw new Error(isActiveCheckArr);
    //     }

    //     const checkErrorForDuplicateUid = resultArr.sqlMessage.split(' ')[5]
    //     console.log(checkErrorForDuplicateUid)
    //     console.log(resultArr.code)
    //     console.log(isActiveCheckArr[0][0].isActive)

    //     if(resultArr.code == "ER_DUP_ENTRY" && checkErrorForDuplicateUid == "'users.PRIMARY'" &&  !(isActiveCheckArr[0][0].isActive)) {


    //         // return console.log("hello");

    //         const query = `update users set isActive = 1, uname = '${uname}' where uid = '${uid}'`;
    //         const resultArr = await execute(query);

    //         if(resultArr instanceof Error) {
    //             res.status(400);
    //             throw new Error(resultArr);
    //         }

    //         res.status(200).json({
    //             success: true,
    //             message: "User registered.",
    //             data: req.body,
    //             startTime: resultArr[1],
    //             endTime: resultArr[2],
    //             totalTime: resultArr[2] - resultArr[1]
    //         });
    //     } 

    //     res.status(400);
    //     throw new Error(resultArr);
    // }

    return sendResponse(
        res,
        registeredUserDetails instanceof Error ? registeredUserDetails : {message: 'User succefully registered', userData: req.body},
        200
    )

});

module.exports = { registerUser };