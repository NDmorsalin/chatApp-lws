function decorateResponse(title) {
    return (req, res, next) => {
        res.locals.title = `${title} - ${process.env.APP_NAME}`;
        res.locals.html = true;
        res.locals.error = {};
        res.locals.data = [];
        res.locals.loggedInUser = {};
        next();
    };
}

module.exports = decorateResponse;
