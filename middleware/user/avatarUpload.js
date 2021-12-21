/* eslint-disable comma-dangle */

// internal dependency
const uploader = require('../../utility/singleFileUpload');

function avatarUpload(req, res, next) {
    const upload = uploader(
        'avatar',
        ['image/jpg', 'image/jpeg', 'image/png'],
        '10000',
        'File type must be jpg, jpeg, or png'
    );
    upload.any()(req, res, (err) => {
        if (err) {
            res.json({
                error: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
}
module.exports = avatarUpload;
