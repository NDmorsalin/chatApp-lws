/* eslint-disable no-underscore-dangle */
// External dependency
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const creatError = require('http-errors');
// internal dependency
const User = require('../model/People');
const Conversation = require('../model/conversation');

// show login page
async function getLogin(req, res, next) {
    res.render('login');
}

// login
async function login(req, res, next) {
    try {
        const user = await User.findOne({
            $or: [{ userName: req.body.userName }, { email: req.body.userName }],
        });
        if (user && user._id) {
            // check password
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);

            if (isValidPassword) {
                // create user token
                const userObj = {
                    userName: user.userName,
                    userId: user._id,
                    email: user.email,
                    mobile: user.mobile,
                    avatar: user.avatar,
                    role: user.role || 'user',
                };
                const token = jwt.sign(userObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE,
                });

                // create cookies
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRE,
                    signed: true,
                    httpOnly: true,
                });
                const conversations = await Conversation.find({
                    $or: [
                        {
                            'creator.id': user.userId,
                        },
                        {
                            'participant.id': user.userId,
                        },
                    ],
                });
                res.locals.data = conversations;

                res.locals.loggedInUser = userObj;

                res.redirect('inbox');
                // res.json(userObj);
            } else {
                throw creatError('Login is failed please try again');
            }
        } else {
            throw creatError('Login is failed please try again');
        }
    } catch (err) {
        // console.log(err);
        res.render('login', {
            data: {
                userName: req.body.userName,
            },
            error: {
                common: {
                    msg: err.message,
                },
            },
        });
        /*  res.status(500).json({
            error: err,
        }); */
    }
}

// Logout
function logout(req, res, next) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send('log out successfully');
}

module.exports = { getLogin, login, logout };
