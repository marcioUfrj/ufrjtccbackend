const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  skill_model_unificado:  { 
    type: Number,
    required: false
  },
  skill_model_semi_unificado:  { 
    type: Number,
    required: false
  },
  skill_model_granular:  { 
    type: Number,
    required: false
  },
  answers: [
    {
      idAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Answer'
      },
      correct: { type: Boolean, required: true }
    }
  ]
})

module.exports = mongoose.model('Question', questionSchema)