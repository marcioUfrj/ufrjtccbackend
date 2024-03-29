const express = require('express')
const router = express.Router()
const Question = require('../models/question')

//Pagina inicial
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
    res.json(questions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//Pagina inicial
router.get('/getPopulated', async (req, res) => {
  try {
    const questions = await Question.find()
                              .populate({ 
                                path: "answers", 
                                populate: { path: "idAnswer", select: "text" }
                              })
    res.json(questions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one Question by ID
router.get('/getPopulated/:id', async (req, res) => {
  try {
    const in_question = await Question.findById(req.params.id)
                                .populate({ 
                                  path: "answers", 
                                  populate: { path: "idAnswer", select: "text" }
                                })
    if (in_question === null){
      throw { message: 'Objeto nao encontrado!' }
    }
    res.json(in_question)
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

// Delete All Question By Can-do
router.delete('/all', async (req, res) => {
  let in_questions
  try {
    in_questions = await Question.find()
    await Promise.all(
      in_questions.map(async(in_q) => {
        await in_q.remove()
      })
    )
    res.json({ message: "Deleted Question" })
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