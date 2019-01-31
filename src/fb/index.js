let express = require('express')
let route = express.Router()
let fetch = require('node-fetch')

let token = ``

let url = 'https://graph.facebook.com/'
let fql = 'https://graph.facebook.com/fql?q='

let q = null

route.get('/', (req, res) => {
    
    q = `/me`
    fetch(url + q + '?access_token=' + token).then(e => e.json()).then(e => res.render('home', {
        data: e
    }))
})

route.get('/friend', (req, res) => {
    
    q = `SELECT uid, name, pic_square, online_presence
                FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())`
    fetch(fql + q + '&access_token=' + token).then(e => e.json()).then(e => res.render('friend', e))
    // res.render('home')
})

route.get('/notify', (req, res) => {
    q = `SELECT notification_id, sender_id, title_html, body_html, title_text, href FROM notification WHERE recipient_id=me()
  AND is_unread = 1 AND is_hidden = 0`
  
    fetch(fql + q + '&access_token=' + token).then(e => e.json()).then(e => res.render('notify', e))
})




module.exports = route