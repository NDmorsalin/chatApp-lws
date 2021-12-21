// external dependency
const express = require('express');

// internal dependency
const {
    getInbox,
    searchUser,
    addConversation,
    getMessage,
    sendMessage,
    deleteConversation,
} = require('../controller/getInbox');
const decorateResponse = require('../middleware/common/decorateResponse');
const { checkLogin } = require('../middleware/common/checkLogin');
const attachmentUploader = require('../middleware/inbox/attachUpload');

// router
const router = express.Router();

const pageTitle = 'inbox page';
router.get('/', decorateResponse(pageTitle), checkLogin, getInbox);

router.post('/search', checkLogin, searchUser);

router.post('/conversation', checkLogin, addConversation);

router.get('/message/:conversation_id', checkLogin, getMessage);

router.post('/message', checkLogin, attachmentUploader, sendMessage);
router.delete('/:conversation_id', checkLogin, deleteConversation);

module.exports = router;
