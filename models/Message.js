const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messageContent: {
      type: {
        type: String,
        enum: ['file', 'text'],
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries on conversations
messageSchema.index({ from: 1, to: 1, createdAt: -1 });
messageSchema.index({ to: 1, from: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
