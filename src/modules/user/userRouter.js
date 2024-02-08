const express = require('express');
const userRouter = express.Router();

const { getUser } = require('./select');
const { registerUser } = require('./register');
const { loginUser } = require('./login');
const { deleteUser } = require('./delete');

const { protect } = require('../../middlewares/authMiddleware');
const { validateUser } = require('../../middlewares/validationMiddleware')

userRouter.get('/user/get', protect, getUser);
userRouter.post('/user/register', validateUser, registerUser);
userRouter.post('/user/login', loginUser);
userRouter.delete('/user/delete', protect, deleteUser);

module.exports = { userRouter };

