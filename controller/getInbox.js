// external Dependency
const createError = require('http-errors');
// internal Dependency
const Conversation = require('../model/conversation');
const Message = require('../model/Message');
const User = require('../model/People');
const escape = require('../utility/escape');

async function getInbox(req, res, next) {
    try {
        const conversations = await Conversation.find({
            $or: [
                {
                    'creator.id': req.user.userId,
                },
                {
                    'participant.id': req.user.userId,
                },
            ],
        });
        res.locals.data = conversations;

        res.render('inbox');
    } catch (err) {
        next(err);
    }
}

// search user for creat new conversation

async function searchUser(req, res, next) {
    const { user } = req.body;

    const searchQuery = user.replace('+88', '');

    const nameSearchRegex = new RegExp(escape(searchQuery), 'i');
    const mobileSearchRegex = new RegExp(`^${escape(`+88${searchQuery}`)}`);
    const emailSearchRegex = new RegExp(`^${escape(searchQuery)}$`, 'i');

    try {
        if (searchQuery !== '') {
            const users = await User.find({
                $or: [
                    { userName: nameSearchRegex },
                    { mobile: mobileSearchRegex },
                    { email: emailSearchRegex },
                ],
            });

            res.json(users);
        } else {
            throw createError('You must provide some text to search!');
        }
    } catch (err) {
        res.status(500).json({
            error: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// add conversation to db
async function addConversation(req, res, next) {
    try {
        const newConversation = await new Conversation({
            creator: {
                id: req.user.userId,
                userName: req.user.userName,
                avatar: req.user.avatar || null,
            },
            participant: {
                id: req.body.id,
                userName: req.body.participant,
                avatar: req.body.avatar || null,
            },
        });

        const result = await newConversation.save();

        res.status(200).json({
            message: 'Conversation was added successfully!',
            result,
        });
    } catch (err) {
        res.status(500).json({
            error: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// get message
async function getMessage(req, res, next) {
    try {
        const message = await Message.find({ conversationId: req.params.conversation_id });

        const { participant } = await Conversation.findById(req.params.conversation_id);
        res.status(200).json({
            data: {
                message,
                participant,
            },
            user: req.user,
            conversation_id: req.params.conversation_id,
        });
    } catch (err) {
        res.status(500).json({
            error: {
                common: {
                    msg: 'unknown error occur to get message',
                },
            },
        });
    }
}

// send message
async function sendMessage(req, res, next) {
    if (req.body.message || (req.files && req.files.length > 0)) {
        try {
            let attachment = null;

            if (req.files && req.files.length > 0) {
                attachment = [];

                req.files.forEach((file) => {
                    attachment.push(file.filename);
                });
            }
            const newMessage = await new Message({
                text: req.body.message,
                attachment,
                sender: {
                    id: req.user.userId,
                    userName: req.user.userName,
                    avatar: req.user.avatar || null,
                },
                receiver: {
                    id: req.body.receiverId,
                    userName: req.body.receiverName,
                    avatar: req.body.avatar || null,
                },
                conversationId: req.body.conversationId,
            });
            const result = await newMessage.save();
            // socket io

            global.io.emit('newMessage', {
                message: {
                    sender: {
                        id: req.user.userId,
                        userName: req.user.userName,
                        avatar: req.user.avatar || null,
                    },
                    conversationId: req.body.conversationId,
                    text: req.body.message,
                    attachment,
                    dateTime: result.dateTime,
                },
            });
            res.json({
                message: 'successful',
                data: result,
            });
        } catch (err) {
            console.log({ errr: 'ataachmenbt file' });
            console.log(err);
            res.status(500).json({
                error: {
                    common: {
                        msg: err.message,
                    },
                },
            });
        }
    } else {
        res.status(500).json({
            error: {
                common: {
                    msg: 'Message or attachment must require',
                },
            },
        });
    }
}

// delete conversation
async function deleteConversation(req, res, next) {
    try {
        const deleteConversation = await Conversation.deleteOne({
            _id: req.params.conversation_id,
        });
        const deleteMessage = await Message.deleteMany({
            conversationId: req.params.conversation_id,
        });
        global.io.emit('deleteCon', {
            deletedMessage: 'Conversation is deleted',
        });
        res.json({
            message: 'successfully  delete Conversation and relative Message ',
            deleteConversation,
            deleteMessage,
        });
    } catch (err) {
        res.status(500).json({
            error: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}
module.exports = {
    getInbox,
    searchUser,
    addConversation,
    getMessage,
    sendMessage,
    deleteConversation,
};
