const express = require('express')
const handlebars = require('express-handlebars')
const request = require('request')
const app = express()
const port = 8080

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
app.use(express.static('static'))

app.get('/', (req, res) => {
  res.send('Hello from XKCD-serv! 👋')
})

app.get('/comic', (req, res) => {
  if (req.query.id) {
    request(`https://xkcd.com/${req.query.id}/info.0.json`, (error, response, body) => {
      if (error) throw error

      console.log(`Response from XKCD website when calling https://xkcd.com/${req.query.id}/info.0.json: ${response} ${response.statusCode}`)

      const bodyToJson = JSON.parse(body)
      const dataToRender = {
        'title': bodyToJson.safe_title,
        'img': bodyToJson.img,
        'desc': bodyToJson.alt
      }
      res.render('comic', dataToRender)
    })
  } else {
    res.send('Find a comic by adding a querystring to the current page. For example: tierneyxkcd.azurewebsites.net/comic?id=112')
  }
})

app.listen(port, () => console.log(`Our app is now listening on port ${port}!`))
