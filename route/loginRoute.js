/* eslint-disable comma-dangle */
// external dependency
const express = require('express');

// internal dependency
const { getLogin, login, logout } = require('../controller/getLogin');
const { getInbox } = require('../controller/getInbox');
const decorateResponse = require('../middleware/common/decorateResponse');
const { loginValidator, loginValidationHandler } = require('../middleware/login/loginValidation');
const { checkLogin, redirectLogin } = require('../middleware/common/checkLogin');

// router
const router = express.Router();

const pageTitle = 'Login ';
// get login page
router.get('/', decorateResponse(pageTitle), redirectLogin, getLogin);

// login user
router.post('/', decorateResponse(pageTitle), loginValidator, loginValidationHandler, login);
// logout
router.delete('/', logout);

module.exports = router;
