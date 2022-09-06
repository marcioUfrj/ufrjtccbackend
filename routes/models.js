const express = require('express')
const router = express.Router()
const Model = require('../models/model')
const { path_model_maps, path_model_params } = require('../public/constants')
const fs = require('fs/promises');


async function loadModels(cd_model) {
  try {
    const data = await fs.readFile(path_model_params[cd_model], { encoding: 'utf8' })
    const json_data = JSON.parse(data)
    return json_data.data
  } catch (err) {
    console.log(err);
  }
}

//Pagina inicial
router.get('/', async (req, res) => {
  try {
    const models = await Model.find()
    res.json(models)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one model by ID
router.get('/active', async (req, res) => {
  try {
    const in_model = await Model.find({ _id: ['6316a828e00b754e3cd1751f', '6316a855e00b754e3cd1752e', '6316a86ce00b754e3cd1753c' ] } )
    res.json(in_model)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one model by ID
router.get('/:id', async (req, res) => {
  try {
    const in_model = await Model.findById(req.params.id)
    res.json(in_model)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create New model
router.post('/', async (req, res) => {
  const in_model = new Model({
    code_model:  req.body.code_model,
    class: req.body.class,
    classifier: req.body.classifier,
    version: req.body.version,
    regulatization: req.body.regulatization,
    regularization_factor: req.body.regularization_factor,
    intercept: req.body.intercept,
    coefs: req.body.coefs,
    encoding: req.body.encoding,
    mapCoefs: Object.entries(req.body.mapCoefs)
  })
  
  try {
    const newmodel = await in_model.save()
    res.status(201).json(newmodel)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Pagina Import from File
router.post('/fromFile', async (req, res) => {
  
  const cd = req.body.model
  
  try {
    const models_json = await loadModels(cd)
    const old_models = await Model.find({
                              code_model:  models_json[0].code_model,
                              class: models_json[0].class,
                              version: models_json[0].version,
                            }, { _id: 1, regularization_factor: 1})

    // Delete old models before saving new ones
    await Promise.all(
      old_models.map(async(old_model) => {
        old_model.remove()
      })
    )

    const saved_models = await Promise.all(
      models_json.map(async(iModel) => {
        const in_model = new Model({
          code_model:  iModel.code_model,
          class: iModel.class,
          version: iModel.version,
          regulatization: iModel.regulatization,
          regularization_factor: iModel.regularization_factor,
          intercept: iModel.intercept,
          coefs: iModel.coefs
        })
        const new_model = await in_model.save()
        return new_model
      })
    )

    res.status(201).json(saved_models)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update model
router.put('/:id', async (req, res) => {
  let in_model
  try {
    in_model = await Model.findById(req.params.id)
    //console.log('in_model: ' + in_model)
    in_model.text = req.body.text
    const updatedmodel = await in_model.save()
    res.json(updatedmodel)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete model
router.delete('/all', async (req, res) => {
  let in_models
  try {
    in_models = await Model.find()
    await Promise.all(
      in_models.map(async(in_a) => {
        await in_a.remove()
      })
    )
    res.json({ message: "Deleted model" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
// Delete model
router.delete('/:id', async (req, res) => {
  let in_model
  try {
    in_model = await Model.findById(req.params.id)
    await in_model.remove()
    res.json({ message: "Deleted Model" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router