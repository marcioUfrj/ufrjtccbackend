const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json('index page from tcc_projeto/back-end/ MUDANDO')
})

module.exports = router