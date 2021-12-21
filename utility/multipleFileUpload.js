/* eslint-disable operator-linebreak */
/* eslint-disable prettier/prettier */
// external dependency
const multer = require('multer');
const createError = require('http-errors');
const path = require('path');

function uploader(subFolderPath, allowedFileType, maxFileSize, maxNumFile, errorMsg) {
    const fileDir = `${__dirname}/../public/upload/${subFolderPath}`;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fileDir);
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName =
            file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') + fileExt + Date.now();
            cb(null, fileName + fileExt);
        },
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (req.files.length > maxNumFile) {
                cb(
                    createError(`Maximum ${maxNumFile} files are allowed to upload!`),
                );
            } else if (allowedFileType.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(createError(errorMsg));
                }
        },

    });

    return upload;
}

module.exports = uploader;
