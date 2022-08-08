const express = require('express')
const router = express.Router()
const Answer = require('../models/answer')

//Pagina inicial
router.get('/', async (req, res) => {
  try {
    const answers = await Answer.find()
    res.json(answers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one Answer by ID
router.get('/:id', async (req, res) => {
  try {
    const in_answer = await Answer.findById(req.params.id)
    res.json(in_answer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create New Answer
router.post('/', async (req, res) => {
  const in_answer = new Answer({
    text: req.body.text
  })
  
  try {
    const newanswer = await in_answer.save()
    res.status(201).json(newanswer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update Answer
router.put('/:id', async (req, res) => {
  let in_answer
  try {
    in_answer = await Answer.findById(req.params.id)
    //console.log('in_answer: ' + in_answer)
    in_answer.text = req.body.text
    const updatedanswer = await in_answer.save()
    res.json(updatedanswer)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete Answer
router.delete('/:id', async (req, res) => {
  let in_answer
  try {
    in_answer = await Answer.findById(req.params.id)
    await in_answer.remove()
    res.json({ message: "Deleted Answer" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router