const asyncHandler = require('express-async-handler');
const mysql = require('mysql2')
const { execute } = require('../../utils/dbConnect');
const { CustomError } = require('../../middlewares/errorMiddleware');
const { sendResponse } = require('../../utils/sendResponse');

const _getSearchedQuestionData = (searchText) => `
    SELECT 
        qid as questionId,
        qtitle as questionTitle, 
        qdescription as questionDescription, 
        uid as userId
    FROM
        questions
    WHERE
        qtitle LIKE '%${searchText}%'
`

const _getAnswersForAQuestion = () => `
    SELECT
        aid as answerId,
        atext as answerText,
        uid as userId
    FROM
        answers
    WHERE
        qid = ?
`

const searchQuestions = asyncHandler( async (req, res) => {
    const { searchText } = req.body;

    if(!searchText) {
        throw new CustomError('Enter text to search for.', 400);
    }

    const searchedQuestions = await execute(_getSearchedQuestionData(searchText));
    let answersForSearchedQuestions = []


    for(let i=0; i<searchedQuestions.length; i++) {
        // console.log(searchedQuestionData[0][i].qid);
        // const query = `select * from answers a join questions q on a.qid = q.qid where qid = '${searchedQuestionData[0][i].qid}'`;
        const getAnswersForAQuestionQueryData = [searchedQuestions[i].questionId];
        let answerForAQuestion = await execute(_getAnswersForAQuestion(), getAnswersForAQuestionQueryData);
        answersForSearchedQuestions.push(answerForAQuestion);
    }

    for(let i=0; i<searchedQuestions.length; i++) {
        searchedQuestions[i] = { ...searchedQuestions[i], answers: answersForSearchedQuestions[i] };
    }

    return sendResponse(
        res,
        searchedQuestions instanceof Error ? searchedQuestions : { message: 'Search results fetched.', searchedQuestions },
        200
    )
})

module.exports = { searchQuestions };