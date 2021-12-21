// external dependency
const jwt = require('jsonwebtoken');
const creatErrors = require('http-errors');

const checkLogin = async (req, res, next) => {
    const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
        try {
            const token = cookies[process.env.COOKIE_NAME];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;

            if (res.locals.html) {
                res.locals.loggedInUser = decode;
            }
            next();
        } catch (err) {
            if (res.locals.html) {
                res.redirect('/');
            } else {
                res.status(500).json({
                    error: {
                        common: {
                            msg: 'authentication failed',
                        },
                    },
                });
            }
        }
        // eslint-disable-next-line padded-blocks
    } else if (res.locals.html) {
        res.redirect('/');
    } else {
        res.status(401).json({
            error: {
                common: {
                    msg: 'authentication failed',
                },
            },
        });
    }
};
const redirectLogin = async (req, res, next) => {
    const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if (!cookies) {
        next();
    } else {
        res.redirect('/inbox');
    }
};

const requireRole = (role) => (req, res, next) => {
    if (req.user.role && role.includes(req.user.role)) {
        next();
    } else if (res.locals.html) {
        next(creatErrors(401, 'you are not authorize'));
    } else {
        console.log(req.user);
        res.status(401).json({
            error: {
                common: {
                    msg: 'you are not authorize',
                },
            },
        });
    }
};

module.exports = { checkLogin, redirectLogin, requireRole };
