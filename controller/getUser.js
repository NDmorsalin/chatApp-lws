// external dependency
const bcrypt = require('bcrypt');
const path = require('path');
const { unlink } = require('fs');

// internal dependency
const User = require('../model/People');

// get user page
async function getUser(req, res, next) {
    try {
        const users = await User.find();
        res.render('user', {
            users,
        });
    } catch (err) {
        next(err);
    }
}

// add user in database
const addUser = async (req, res, next) => {
    let newUser;
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashPassword,
        });
    }

    try {
        await newUser.save();
        res.json({
            message: 'New user added successfully',
        });
    } catch (err) {
        res.json({
            error: {
                common: {
                    mse: 'unknown error occur',
                },
            },
        });
    }
};

// remove user
const removeUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.params.id });

        if (user.avatar) {
            const avatarPath = path.join(__dirname, `../public/upload/avatar/${user.avatar}`);
            await unlink(avatarPath);
        }

        res.join({
            message: 'user is deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            error: {
                common: {
                    msg: 'could not delete user',
                },
            },
        });
    }
};
module.exports = { getUser, addUser, removeUser };
