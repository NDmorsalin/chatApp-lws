/* eslint-disable comma-dangle */
// external dependency
const express = require('express');

// internal dependency
const { getUser, addUser, removeUser } = require('../controller/getUser');
const avatarUpload = require('../middleware/user/avatarUpload');
const { addUserValidator, addUserValidatorHandler } = require('../middleware/user/userValidation');
const decorateResponse = require('../middleware/common/decorateResponse');
const { checkLogin, requireRole } = require('../middleware/common/checkLogin');

// router
const router = express.Router();

// user page
router.get('/', decorateResponse('user'), checkLogin, requireRole(['admin']), getUser);

// add user
router.post(
    '/',
    checkLogin,
    requireRole(['admin']),
    avatarUpload,
    addUserValidator,
    addUserValidatorHandler,
    addUser
);

// delete user
router.delete('/:id', checkLogin, requireRole(['admin']), removeUser);

// export
module.exports = router;
