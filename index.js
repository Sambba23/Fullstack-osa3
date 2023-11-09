const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let notes = [
  {
    id: 1,
    content: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    content: "billabong",
    number: "040-123356"
  },
  {
    id: 3,
    content: "Arto dab",
    number: "040-113456"
  },
  {
    id: 4,
    content: "Kaisla Kakkanen",
    number: "040-113456"
  },
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return Math.floor(Math.random() * (10000 - maxId )) + maxId 
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content || !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing.' 
    });
  }

  if (notes.some(note => note.content === body.content || note.number === body.number)) {
    return response.status(400).json({ 
      error: 'Name or number already exists in the phonebook.' 
    });
  }
  
  const note = {
    id: generateId(),
    content: body.content,
    number: body.number, 
  }
  
  notes = notes.concat(note)
  response.json(note)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons', (req, res) => {
res.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

app.get('/info', (req, res) => {
    const htmlContent = `
      <div>
        <p>Phonebook has info for ${notes.length} people</p>
        <p>${new Date()}</p>
      </div>
    `;
    res.send(`${htmlContent}`);
  });

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})