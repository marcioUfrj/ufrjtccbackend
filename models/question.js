const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answers: [
    {
      idAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Answer'
      },
      correct: { type: Boolean, required: true }
    }
  ]
})

module.exports = mongoose.model('Question', questionSchema)