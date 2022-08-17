const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  index_val: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [
    {
      idQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Question'
      },
      question: {
        type: String,
        required: false
      },
      skill_model_a:  { 
        type: Number,
        required: false
      },
      skill_model_b:  { 
        type: Number,
        required: false
      },
      skill_model_c:  { 
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
          text: { type: String, required: false },
          correct: { type: Boolean, required: false } 
        }
      ]
    }
  ],
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  cando_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'CanDo'
  }
})

module.exports = mongoose.model('Exercise', exerciseSchema)