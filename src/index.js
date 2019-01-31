let express = require('express')
let app = express()
let api = require('./routes')
let path = require('path')
let fb = require('./fb')
let mongoose = require('mongoose')
let fs = require('fs')
let port = process.env.PORT || 8000
let urlMongo = ''
let Logger = require('./logger.js')

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

app.use('/api', api)

app.use('/facebook', fb)

app.get('/view-log-hi', (req ,res) => {
  mongoose.connect(urlMongo)
  Logger.find().exec((err, loggers) => {
    if (err) return
    res.send(loggers.toString())
  })
})
app.all('*', (req, res) => {
  res.json({
    'status': 'error',
    'message': 'Page not found'
  },404)
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})