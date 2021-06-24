const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const Schema = mongoose.Schema
const router = express.Router()

app.use(cors())
app.use(bodyParser.json())

// Connect Server
app.listen(4000, () => {
  console.log('server is up and running on port 4000')
})

// Connect DB
const dist =
  'mongodb+srv://fabezio:C0denCQRT!@cluster0.0r1tc.mongodb.net/todo-items?retryWrites=true&w=majority'
// const db = 'mongodb://localhost/todo-items'
mongoose
  .connect(dist, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('successfully connected to db'))
  .catch((err) => console.log(err))

// Todo Schema
const todoSchema = new Schema({
  text: String,
  isCompleted: Boolean
})
const Todo = mongoose.model('Todo', todoSchema)

// Routes
app.use('/todos', cors(), router)

// read
router.route('/').get(function (_, res) {
  Todo.find(function (err, items) {
    return err
      ? res.send(400).send(`ERROR ${err}`)
      : res.status(200).send(items)
  })
})

// create
router.route('/add').post(function (req, res) {
  const todo = new Todo(req.body)
  todo
    .save()
    .then(() => {
      res.status(200).send({ message: `${todo.text} is successfully added` })
    })
    .catch((err) =>
      res.status(400).send({ error: `error adding document ${err}` })
    )
})

// update
router.route('/:id').put(function (req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    console.log(req.params.id)
    if (err) { res.send(err) }
    todo.text = req.body.text
    todo.isCompleted = !req.body.isCompleted
    todo.save(function (err) {
      if (err) { res.send(err) }
      res.json({ message: `${todo.text} is successfully updated` })
    })
  })
})

// delete
router.route('/:id').delete(function (req, res) {
  Todo.findByIdAndRemove(req.params.id, function () {
    res.status(200).send({ message: 'todo is successfully deleted' })
  }).catch((err) =>
    res.status(400).send({ error: `error adding document ${err}` })
  )
})
