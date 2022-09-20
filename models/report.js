const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    nivelJLPT: {
      type: String,
      required: true
    },
    nivelJLPTProgresso: {
      type: String,
      required: true
    },
    idCanDo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CanDo'
    },
    answers: [
      {
        idAnswerSelected: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Answer'
        },
        idQuestion: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Question'
        },
        idExercise: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Exercise'
        },
        score: {
          type: Number,
          required: true
        },
        initialTime: {
          type: String,
          required: true
        },
        finalTime: {
          type: String,
          required: true
        }
      }
    ],
    createdDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    models_output: [
      {
        id_model: { type: String, required: true },
        proba: { type: Number, required: true }
      }
    ]
  }
)

module.exports = mongoose.model('Report', reportSchema)