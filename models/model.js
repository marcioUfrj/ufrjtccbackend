const mongoose = require('mongoose');


/*
 * code_model = { skill_model_u, skill_model_su, skill_model_g }
 */

const modelSchema = new mongoose.Schema({
  code_model:  { 
    type: String,
    required: true
  },
  class: { type: String },
  classifier: { type: String },
  version: { type: String },
  regulatization: { type: String },
  regularization_factor: { type: Number },
  limiar: { type: Number },
  intercept: { type: Number },
  coefs: [Number],
  encoding: [String],
  mapCoefs: {
    type: Map,
    of: String
  }
})

module.exports = mongoose.model('Model', modelSchema)