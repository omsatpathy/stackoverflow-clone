const asyncHandler = require("express-async-handler");
const { execute } = require("../../utils/dbConnect");
const mysql = require('mysql2');
const { sendResponse } = require("../../utils/sendResponse");

const _insertQuestion = () => `
    INSERT INTO
        questions
    VALUES
        (?, ?, ?, ?, now(), now())
`

const insertQuestion = asyncHandler(async (req, res) => {
    const { qid, qtitle, qdescription } = req.body;
    
    const { uid } = req.user;

    const queryData = [qid, qtitle, qdescription, uid]

    const postedQuestionDetails = await execute(_insertQuestion(), queryData);

    return sendResponse(
        res,
        postedQuestionDetails instanceof Error ? postedQuestionDetails : {message: 'Question succesfully posted.', questionData: {...req.body, uid}},
        200
    )
})

module.exports = { insertQuestion };