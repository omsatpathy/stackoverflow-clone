const express = require('express');
const searchRouter = express.Router();

const { searchQuestions } = require('./searchController');

searchRouter.get('/search', searchQuestions);

module.exports = { searchRouter };