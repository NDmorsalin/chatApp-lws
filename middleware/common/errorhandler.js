// external dependency
const creatError = require('http-errors');

// 404 not found
function notFound(req, res, next) {
    next(creatError(404, 'requested page not found'));
}

// default error
function defaultError(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message };
    console.log(err);
    console.log({ errUrl: req.originalUrl });
    res.status(err.status || 500);
    if (res.locals.html) {
        res.render('error');
    } else {
        res.json(res.locals.error);
    }
}
module.exports = {
    notFound,
    defaultError,
};
