const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('Phonebook backend is running!')
})

app.get('/api/persons', (request, response) => {
    try {
        console.log('fetching people from the phonebook database')
        console.log('fetched people', persons)
        response.json(persons)
    } catch (error) {
        console.log(error);
    }
})

app.get('/api/persons/:id', (request, response) => {
    console.log('fetching person from the phonebook database')

    const person = persons[request.params.id]

    if (!person) {
        return response.status(404).json({ error: 'Person not found' })
    }

    console.log('fetched', person)
    response.json(person)
})

app.get('/info', (request, response) => {
    try {
        const personCount = persons.length
        const time = new Date()

        response.send(
            `
            <p>Phonebook has info for ${personCount} people</p>
            <p>${time}</p>
            `
        )
    } catch (error) {
        console.log(error);
    }
})

app.delete('/api/persons/:id', (request, response) => {


    const id = request.params.id
    const index = persons.findIndex(item => item.id === id)

    if (index === -1) {
        return response.status(404).json({ error: 'Person could not be found' })
    } else {
        console.log(`deleting ${persons[index]} from the phonebook database`)
        persons.splice(index, 1)
        response.json({ message: `person deleted successfully` })
        response.status(204).end()
    }
})

app.post('/api/persons', (request, response) => {
    console.log('Receive POST request:', request.body)

    const generateId = () => {
        const randomNumber = Math.floor(Math.random() * 1000)
        return String(randomNumber)
    }

    const { name, number } = request.body
    if (!name || !number) {
        return response.status(400).json({ error: 'name or number is missing' })
    } else {
        const body = request.body
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }

        persons = persons.concat(person)
        response.json(person)
    }


})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})