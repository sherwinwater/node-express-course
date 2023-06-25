const express = require('express')
const app = express()

app.get('/', (req, res) => {
  console.log('user hit the resource')
  res.status(200).send('Home Page')
})

app.get('/about', (req, res) => {
  res.status(200).send('About Page')
})

// server sent events
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  send(res)
})

let i = 0
function send (res) {
  res.write('data: ' + `hello from sse ---- [${i++}]\n\n`)

  setTimeout(() => send(res), 3000)
}

app.all('*', (req, res) => {
  res.status(404).send('<h1>resource not found</h1>')
})

app.listen(5000, () => {
  console.log('server is listening on port 5000...')
})

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen
