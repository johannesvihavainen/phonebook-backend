const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('post', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

const mongoose = require('mongoose')

const url = 'mongodb+srv://johannesvihavainen:IF4D4V1OLmQjMRzx@cluster0.onsen.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Database connection error:', error.message))

app.get('/', (request, response) => {
  response.send('Phonebook backend is running!')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('fetching person from the phonebook database')

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).json({ error: 'Person not found' })
      } else {
        response.json(person)
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const time = new Date()

      response.send(
        `
                <p>Phonebook has info for ${count} people</p>
                <p>${time}</p>
                `
      )
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(400).json({ error: 'Person could not be found' })
      }

    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  console.log('Receive POST request:', request.body)

  // const generateId = () => {
  //     const randomNumber = Math.floor(Math.random() * 1000)
  //     return String(randomNumber)
  // }

  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' })
  } else {
    const person = new Person({
      name,
      number
    })

    person.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted ID' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)