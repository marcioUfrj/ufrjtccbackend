const { response } = require('express')
const express = require('express')
const router = express.Router()
const Report = require('../models/report')
const { path_model_maps } = require('../public/constants')

// await fs.writeFile(path_model_maps[cd_model], JSON.stringify(Object.fromEntries(mapping)))

const mapping = new Map(
  [
    ['id_user_1', 1],
    ['id_user_2', 2],
    ['id_item_1', 3],
    ['id_item_2', 4]
  ]
)

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find() // retorna array com Report
    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get Report By User ID
router.get('/getPopulated/byUser/:id', async (req, res) => {
  try {
    const report = await Report.find({ idUser: req.params.id }) // retorna array com Report
                          .populate({
                            path: "answers",
                            populate: { path: "idQuestion", 
                                        select: [ "skill_model_unificado", "skill_model_semi_unificado", "skill_model_granular" ]
                            }
                          })
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get Report By Report ID
router.get('/getPopulated/:id', async (req, res) => {
  try {
    const report = await Report.find({ _id: req.params.id }) // retorna array com Report
                          .populate({
                            path: "answers",
                            populate: { path: "idQuestion", 
                                        select: [ "skill_model_unificado", "skill_model_semi_unificado", "skill_model_granular" ]
                            }
                          })
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get Report By Can Do ID
router.get('/ByCanDo/:id', async (req, res) => {
  try {
    const report = await Report.find(
                          { idCanDo: req.params.id }
                          //{ _id: 1, idCanDo: 0, idUser: 0 } //, 'answers.idAnswerSelected': 1, 'answers.idQuestion': 1 } //, 'answers.idExercise': 0, 'answers.initialTime': 0, 'answers.finalTime': 0}
                        ) // retorna array com Report
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get Report By User ID
router.get('/ByUser/:id', async (req, res) => {
  try {
    const report = await Report.find({ idUser: req.params.id }) // retorna array com Report
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Generate data CSV
router.get('/generateModelDataCSV', async (req, res) => {
  try {
    const reports = await Report.find()
                            .populate({
                              path: "answers",
                              populate: { path: "idQuestion", 
                                          select: [ "skill_model_unificado", "skill_model_semi_unificado", "skill_model_granular" ]
                              }
                            })

    export_data = reports.reduce((accRow, report) => {
      //rows returns an array that would be inside an "map" array => reduce to flatten an array of arrays
      rows = report.answers.reduce((accData, answer) => {
          accData[`${answer.idQuestion[req.body.code_model]}_wins`] ??= 0
          accData[`${answer.idQuestion[req.body.code_model]}_fails`] ??= 0
          accData.rows.push({
            user : report.idUser,
            item : answer.idQuestion._id,
            skill : answer.idQuestion[req.body.code_model],
            correct : answer.score,
            wins : accData[`${answer.idQuestion[req.body.code_model]}_wins`],
            fails : accData[`${answer.idQuestion[req.body.code_model]}_fails`]
          })
          accData[`${answer.idQuestion[req.body.code_model]}_wins`] += answer.score
          accData[`${answer.idQuestion[req.body.code_model]}_fails`] += 1 - answer.score
          return accData
      },
      { rows : [] })
      return accRow.concat(rows.rows)
    },
    [])

    res.json(export_data)
  } catch (err) {
    response.status(500).json({ message: err.message })
  }
})

// Get one Report By Report ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.find({ _id: req.params.id }) // retorna array com Report
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Insert New Report
router.post('/', async (req, res) => {
  const inReport = new Report({
    idUser:  req.body.idUser,
    nivelJLPT:  req.body.nivelJLPT,
    nivelJLPTProgresso:  req.body.nivelJLPTProgresso,
    idCanDo: req.body.idCanDo,
    answers: req.body.answers
  })
  
  try {
    const newReport = await inReport.save()
    res.json(newReport)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update Report
router.put('/:id', async (req, res) => {
  let inReport
  try {
    inReport = await Report.findById(req.params.id)
    
    inReport.answers = req.body.answers
    
    const editReport = await inReport.save()
    res.json(editReport)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete Report
router.delete('/:id', async (req, res) => {
  let inReport
  try {
    inReport = await Report.findById(req.params.id)
    
    await inReport.remove()
    res.json("Relatorio deletado")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Report By Can Do {id}
router.delete('/ByCanDo/:id', async (req, res) => {
  let inReport
  try {
    inReport = await Report.find({ idCanDo: req.params.id })
    
    inReport.forEach( async (item) => {
      await item.remove()
    })

    res.json("Relatorios deletados para o CanDo solicitado.")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router