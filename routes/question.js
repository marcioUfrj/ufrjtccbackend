const express = require('express')
const router = express.Router()
const Question = require('../models/question')

//Pagina inicial
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
                              .populate({ path: "answers", 
                                          populate: { path: "idAnswer", select: "text" }})
    res.json(questions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one Question by ID
router.get('/:id', async (req, res) => {
  try {
    const in_question = await Question.findById(req.params.id)
    if (in_question === null){
      throw { message: 'Objeto nao encontrado!' }
    }
    res.json(in_question)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create New Question
router.post('/', async (req, res) => {
  const in_question = new Question({
    question: req.body.question,
    answers: req.body.answers
  })
  
  try {
    const newquestion = await in_question.save()
    res.status(201).json(newquestion)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update Question
router.put('/:id', async (req, res) => {
  let in_question = null
  try {
    in_question = await Question.findById(req.params.id)
    if (in_question === null){
      throw { message: 'Objeto nao encontrado!' }
    }
    //console.log('in_question: ' + in_question)
    in_question.question = req.body.question
    in_question.answers = req.body.answers

    const updatedquestion = await in_question.save()
    res.json(updatedquestion)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete Question
router.delete('/:id', async (req, res) => {
  let in_question
  try {
    in_question = await Question.findById(req.params.id)
    await in_question.remove()
    res.json({ message: "Deleted Question" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router