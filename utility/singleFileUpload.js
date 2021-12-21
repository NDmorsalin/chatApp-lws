// external dependency
const multer = require('multer');
const path = require('path');
const creatError = require('http-errors');

function uploader(subfolder, uploadedFileType, maxFileSize, errMsg) {
    // file upload folder
    const uploadFolder = `${__dirname}/../public/upload/${subfolder}`;

    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadFolder);
        },
        filename(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            const filename = `${file.originalname
                .replace(fileExt, '')
                .split(' ')
                .join('-')}-${Date.now()}`;

            cb(null, filename + fileExt);
        },
    });

    const upload = multer({
        storage,
        fileFilter(req, file, cb) {
            if (uploadedFileType.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(creatError(errMsg));
            }
        },
        limits: {
            fileSize: maxFileSize,
        },
    });

    return upload;
}
module.exports = uploader;
