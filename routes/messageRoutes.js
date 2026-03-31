const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const messageController = require('../controllers/messageController');

/**
 * Configure Multer for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this directory exists
    cb(null, './uploads/messages');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `msg-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Protect all routes - Assuming req.user is populated by earlier middleware
// router.use(protectMiddleware);

// GET "/' lấy message cuối cùng của mỗi user
router.get('/', messageController.getLatestMessages);

// get"/userID" - lấy toàn bộ message with userID
router.get('/:userId', messageController.getConversation);

// post nội dung bao gồm file hoặc text
router.post('/', upload.single('file'), messageController.sendMessage);

module.exports = router;
