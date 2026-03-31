const Message = require('../models/Message');

/**
 * @desc    Get all messages between current user and a specific user
 * @route   GET /:userId
 */
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Send a message (text or file)
 * @route   POST /
 */
exports.sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user._id;

    let messageContent = {};

    // Check if there's a file from multer (req.file)
    if (req.file) {
      messageContent = {
        type: 'file',
        text: req.file.path, // path to the uploaded file
      };
    } else {
      messageContent = {
        type: 'text',
        text: text, // text content
      };
    }

    const newMessage = await Message.create({
      from,
      to,
      messageContent,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get the last message for each conversation involving the current user
 * @route   GET /
 */
exports.getLatestMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: currentUserId }, { to: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          // Identify conversation by sorting user IDs
          _id: {
            $cond: {
              if: { $lt: ['$from', '$to'] },
              then: { user1: '$from', user2: '$to' },
              else: { user1: '$to', user2: '$from' },
            },
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$lastMessage' },
      },
      {
        $sort: { createdAt: -1 },
      },
      // Optionally populate the 'from' and 'to' fields
      /*
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'fromUser'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'to',
          foreignField: '_id',
          as: 'toUser'
        }
      }
      */
    ]);

    res.status(200).json({
      success: true,
      data: latestMessages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
