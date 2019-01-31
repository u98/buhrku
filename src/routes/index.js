let express = require('express')
let router = express.Router()
let fetch = require('node-fetch')
let fs = require('fs')
let date = require('date-and-time')
let mongoose = require('mongoose')
let urlMongo = 'mongodb://heroku_6w4m6kjp:24v3a6ip7jkep43663kqagtvh@ds137763.mlab.com:37763/heroku_6w4m6kjp'
process.env.TZ = 'Asia/Ho_Chi_Minh'
let api_url = 'http://api.tiktokv.com/aweme/v1'
let apit_url = 'https://t.tiktok.com/aweme/v1'
let Logger = require('./../logger.js')
let cors = require('cors')
mongoose.connect(urlMongo)


router.use(cors(), (err, req, res, next) => {
  if (err.message !== 'error_cors') return next()
  res.json({
    'status': 'error',
    'message': 'Request not allowed by CORS'
  }, 403)
})

router.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  date.locale('vi')
  let time = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
  Logger.create({
    time: time,
    ip: ip,
    url: req.originalUrl
  })
  next()
})

router.get('/home/:id?', (req, res) => {
  let cursor = 0
  let count = 5
  if (req.params.id >= 1)
    cursor = req.params.id
  cursor *= count
  fetch(`${api_url}/category/list/?cursor=${cursor}&count=${count}&carrier_region=VN&aid=1180`)
  .then(e => e.json())
  .then(e => res.json(e))
})

router.get('/detail_user/:user_id', (req, res) => {
  fetch(`${api_url}/user/?user_id=${req.params.user_id}&carrier_region=VN&mcc_mnc=45201&aid=1180`)
  .then(e => e.json())
  .then(e => res.json(e))
})

router.get('/posts/:user_id/:max_cursor?', (req, res) => {
  let mCursor = 0;
  if (req.params.max_cursor >= 1)
    mCursor = req.params.max_cursor
  fetch(`${apit_url}/aweme/post/?user_id=${req.params.user_id}&count=20&max_cursor=${mCursor}&aid=1180&_signature=`)
  .then(e => e.json())
  .then(e => res.json(e))
})

router.get('/challenge/:ch_id/:cursor?', (req, res) => {
  let count = 20
  let cursor = 0
  if (req.params.cursor >= 1)
    cursor = req.params.cursor
  cursor *= cursor*count
  fetch(`${apit_url}/challenge/aweme/?ch_id=${req.params.ch_id}&cursor=${cursor}&count=${count}&retry_type=no_retry&carrier_region=VN&carrier_region_v2=452&timezone_offset=25200&aid=1180`)
  .then(e => e.json())
  .then(e => res.json(e))
})

router.get('/music/:id_music/:cursor?', (req, res) => {
  let count = 20
  let cursor = 0
  if (req.params.cursor >= 1)
    cursor = req.params.cursor
  cursor *= cursor*count
  fetch(`${apit_url}/music/aweme/?music_id=${req.params.id_music}&cursor=${cursor}&count=${count}&type=6&retry_type=no_retry&carrier_region=VN&carrier_region_v2=452&aid=1180`)
  .then(e => e.json())
  .then(e => res.json(e))
})

router.get('/play_add/:id_vid', (req, res) => {
  fetch(`${api_url}/play/?video_id=${req.params.id_vid}&line=1&ratio=720p&media_type=4&vr_type=0&test_cdn=None&improve_bitrate=0`).then(e => {
    res.json({
      'status': 'success',
      'play_add': e.url.replace('http', 'https')
    })
  })
})

module.exports = router