/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    },
);

const People = mongoose.model('People', peopleSchema);

module.exports = People;
