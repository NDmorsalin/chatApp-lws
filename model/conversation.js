/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema(
{
    creator: {
        id: mongoose.Types.ObjectId,
        userName: String,
        avatar: String,
    },
    participant: {
        id: mongoose.Types.ObjectId,
        userName: String,
        avatar: String,
    },
    last_update: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
},
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
