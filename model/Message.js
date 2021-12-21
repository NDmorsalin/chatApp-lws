/* eslint-disable comma-dangle */
// External dependency
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        text: String,
        attachment: [],
        sender: {
            id: mongoose.Types.ObjectId,
            userName: String,
            avatar: String,
        },
        receiver: {
            id: mongoose.Types.ObjectId,
            userName: String,
            avatar: String,
        },
        dateTime: {
            type: Date,
            default: Date.now,
        },
        conversationId: {
            type: mongoose.Types.ObjectId,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
