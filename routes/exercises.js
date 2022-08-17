const express = require('express')
const router = express.Router()
const Exercise = require('../models/exercise')
const Question = require('../models/question')
const Answer = require('../models/answer')


router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find() // retorna array com exercise
    res.json(exercises)
  } catch (err) {
    console.log('erro buscando exercicios by can-do')
    res.status(500).json({ message: err.message })
  }
})

// Create Question and Answer DataBase by Can-Do
router.get('/createQuestionsDB/ByCanDo/:idCanDo', async (req, res) => {
  
  console.log()
  console.log('antes do try')
  try {
    const exercises = await Exercise.find({ cando_id : req.params.idCanDo }, { _id : 1 }) // retorna array com exercise
    if (exercises === []) {
      throw { message: 'Can-do não existe para o ID enviado.'}
    }
 
    //console.log(exercises)
    exercises.forEach(async(exercise) => {
      let in_exercise = await Exercise.findById(exercise._id)
      console.log(`buscou exercicio: ${in_exercise._id}`)
      console.log()

      const new_questions = await Promise.all(
        in_exercise.questions.map(async(q, index) => {

          const new_answers = await Promise.all(
            q.answers.map(async(answer) => {
              const new_answer = new Answer({
                text: answer.text
              })
              const saved_a = await new_answer.save()
              return { idAnswer: saved_a._id, correct: answer.correct }
            })
          )
          
          const new_q = new Question({
            question: q.question,
            skill_model_a: q.skill_model_a,
            skill_model_b: q.skill_model_b,
            skill_model_c: q.skill_model_c,
            answers: new_answers
          })
          const saved_q = await new_q.save()
          return { idQuestion: saved_q._id }
        })
      )
      
      console.log('new questions')
      console.log(new_questions[0])
      in_exercise.questions = new_questions
      await in_exercise.save()
    })

    //const new_exercises = await Exercise.find({ cando_id : req.params.idCanDo })

    res.json('new_exercises created')
  } catch (err) {
    console.log('erro buscando exercicios by can-do')
    res.status(500).json({ message: err.message })
  }
})

// Get all Exercises by single Can-Do
router.get('/getPopulated/ByCanDo/:idCanDo', async (req, res) => {
  try {
    let exercises = await Exercise.find({ cando_id: req.params.idCanDo }) // retorna array com exercise
                              .populate({ 
                                path: "questions", 
                                populate: { path: "idQuestion", select: ["question", "skill_model_a", "skill_model_b", "skill_model_c", "answers"] }
                              })

    const adj_exercises = exercises.map(e => {
      e.questions = e.questions.map(q => {
        return { 
          question: q.idQuestion.question,
          skill_model_a: q.idQuestion.skill_model_a,
          skill_model_b: q.idQuestion.skill_model_b,
          skill_model_c: q.idQuestion.skill_model_c,
          answers: q.idQuestion.answers 
        }
      })
      return e
    })

    const pop_exercises = await Promise.all(
      adj_exercises.map(async(e) => {
        const pop_e = await e.populate({ 
          path: "questions", 
          populate: { 
            path: "answers", 
            populate: {
              path: "idAnswer"
            }
          }
        })
        return e
      })
    )

    res.json(pop_exercises)
  } catch (err) {
    console.log('erro buscando exercicios by can-do')
    res.status(500).json({ message: err.message })
  }
})

// Get all Exercises by single Can-Do
router.get('/ByCanDo/:idCanDo', async (req, res) => {
  try {
    const exercises = await Exercise.find({ cando_id: req.params.idCanDo }) // retorna array com exercise
    res.json(exercises)
  } catch (err) {
    console.log('erro buscando exercicios by can-do')
    res.status(500).json({ message: err.message })
  }
})

// Get one Exercise
router.get('/:id', async (req, res) => {
  console.log('render => lessons/lesson/can-do/exercise: ' + req.params.id_nivel + '  ' + req.params.idCanDo + ' ' + req.params.id)
  try {
    const exercise = await Exercise.find({ _id: req.params.id }) // retorna array com exercise
    res.json(exercise)
  } catch (err) {
    console.log('erro buscando exercicio')
    res.status(500).json({ message: err.message })
  }
})

// Insert New Can-do Exercise
router.post('/', async (req, res) => {
  const inExercise = new Exercise({
    name: req.body.name,
    index_val: parseInt(req.body.index_val),
    description: req.body.description,
    questions: req.body.questions,
    cando_id: req.body.cando_id
  })
  
  try {
    const newExercise = await inExercise.save()
    res.json(newExercise)
  } catch (err) {
    console.log('erro criando exercicio')
    res.status(400).json({ message: err.message })
  }
})

// Update Can-do Exercise
router.put('/:id', async (req, res) => {
  let in_exercise
  try {
    in_exercise = await Exercise.findById(req.params.id)
    
    in_exercise.cando_id = req.body.cando_id
    in_exercise.index_val = parseInt(req.body.index_val),
    in_exercise.name = req.body.name
    in_exercise.description = req.body.description    
    in_exercise.questions = req.body.questions
    
    const editExercise = await in_exercise.save()
    res.json(editExercise)
  } catch (err) {
    console.log('erro atualizando exercicio')
    res.status(400).json({ message: err.message })
  }
})

// Delete Can-do Exercise
router.delete('/:id', async (req, res) => {
  let in_exercise
  try {
    in_exercise = await Exercise.findById(req.params.id)
    
    await in_exercise.remove()
    res.json("Exercicio deletado")
  } catch (err) {
    console.log('erro atualizando exercicio')
    res.status(500).json({ message: err.message })
  }
})

module.exports = router