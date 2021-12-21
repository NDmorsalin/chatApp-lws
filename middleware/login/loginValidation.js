// external dependency
const { check, validationResult } = require('express-validator');

const loginValidator = [
    check('userName').isLength({ min: 1 }).withMessage('Mobile number or Email is required').trim(),
    check('password').isLength({ min: 1 }).withMessage('Password is required'),
];

// login validation error handler
const loginValidationHandler = (req, res, next) => {
    const error = validationResult(req);
    const mappedError = error.mapped();

    if (Object.keys(mappedError).length === 0) {
        next();
    } else {
        /* res.status(500).json({
            mappedError,
        }); */
        res.render('login', {
            data: {
                userName: req.body.userName,
            },
            error: mappedError,
        });
    }
};

// export
module.exports = {
    loginValidator,
    loginValidationHandler,
};
