const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat',
    maxlength: [100, 'Chat title cannot exceed 100 characters']
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

chatSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
