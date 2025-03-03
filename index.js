const express = require('express')
const app = express()

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

// app.get('/', (request, response) => {
//     response.send('Phonebook backend is running!')
// })

app.get('/api/persons', (request, response) => {
    try {
        console.log('fetching people from the phonebook database')
        console.log('fetched people', persons)
        response.json(persons)
    } catch (error) {
        console.log(error);
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})