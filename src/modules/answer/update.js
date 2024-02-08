const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const { sendResponse } = require("../../utils/sendResponse");
const { CustomError } = require("../../middlewares/errorMiddleware");

const _updateAnswer = () => `
    UPDATE 
        answers
    SET 
        atext = ?, updatedAt = now()
    WHERE
        aid = ? and uid = ?
`

const updateAnswer = asyncHandler(async (req, res) => {
    const { atext } = req.body;

    if(!atext) {
        throw new CustomError('Fill all fields properly.', 400)
    }

    const { uid } = req.user;
    const { aid } = req.params;

    const queryData = [atext, aid, uid]
    const updatedAnswerDetails = await execute(_updateAnswer(), queryData);

    if(!(updatedAnswerDetails.affectedRows)) {
        throw new CustomError("Not authorized or invalid question ID.", 401);
    }

    return sendResponse(
        res,
        updatedAnswerDetails instanceof Error
         ? 
         updatedAnswerDetails : { message: 'Answer succesfully updated.', updatedAnswerData: {aid, ...req.body, uid} },
        200
    )

})

module.exports = { updateAnswer };