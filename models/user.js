const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true
  },
  adult: {
    type: Boolean,
    required: true
  },
  agreeTermsOfUse: {
    type: Boolean,
    required: true
  },
  nivelCEFR: {
    type: String,
    required: true
  },
  nivelJLPT: {
    type: String,
    required: true
  },
  nivelJLPTProgresso: {
    type: String,
    required: true
  },
  nivelShirai: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  loginId: {
    type: String,
    required: true
  },
  modelId: {
    type: Number,
    required: true
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)