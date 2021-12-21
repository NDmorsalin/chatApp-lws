// external dependency
const { check, validationResult } = require('express-validator');
const creatError = require('http-errors');
const { unlink } = require('fs');
const path = require('path');

// internal dependency
const User = require('../../model/People');

const addUserValidator = [
    check('userName')
        .isLength({ min: 1 })
        .withMessage('name is require')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('name is not contain anything other then alphabet')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw creatError('Email is already use');
                }
            } catch (err) {
                throw creatError(err.message);
            }
        }),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true,
        })
        .withMessage('mobile number must be Bangladeshi Mobile number')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw creatError('Mobile is already use');
                }
            } catch (err) {
                throw creatError(err.message);
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage('Password must be 1 number 1 Uppercase 1 lowercase 1 symbols'),
];

// validation error handler
const addUserValidatorHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // delete uploaded file which is uploaded by previous middleware
        if (req.files.length > 0) {
            const { filename } = req.files[0];
            const filePath = path.join(__dirname, `../../public/upload/avatar/${filename}`);

            unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.json({
            error: mappedErrors,
        });
    }
};

module.exports = {
    addUserValidator,
    addUserValidatorHandler,
};
