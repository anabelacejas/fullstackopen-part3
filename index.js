const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('data', (req, res) => {
  return req.method == 'POST' ? JSON.stringify(req.body) : ' '
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/', (resquest, response) => {
  response.send('Hello world!')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const info = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date()}</p>`
  response.send(info)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    ...request.body,
  }

  if (persons.some((person) => person.name === newPerson.name)) {
    return response.status(400).json({
      error: 'name already exist on the phonebook',
    })
  }
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
