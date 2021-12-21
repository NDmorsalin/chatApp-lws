/* eslint-disable comma-dangle */
// external dependency
const uploader = require('../../utility/multipleFileUpload');

function attachUploader(req, res, next) {
    const upload = uploader(
        'attachment',
        ['image/jpg', 'image/jpeg', 'image/png'],
        2000000,
        3,
        'File type must be jpg, jpeg, or png'
    );

    upload.any()(req, res, (err) => {
        if (!err) {
            next();
        } else {
            res.status(500).json({
                error: {
                    attachment: {
                        msg: err.message,
                    },
                },
            });
        }
    });
}

module.exports = attachUploader;
