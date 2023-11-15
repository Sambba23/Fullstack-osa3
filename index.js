const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Note = require('./mongo')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('public/build'))


morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));




const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return Math.floor(Math.random() * (10000 - maxId )) + maxId 
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name|| !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing.' 
    });
  }

  if (Note.some(note => note.name === body.name || note.number === body.number)) {
    return response.status(400).json({ 
      error: 'Name or number already exists in the phonebook.' 
    });
  }
  
  const note = new Note({
    id: generateId(),
    name: body.name,
    number: body.number, 
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Notes = Note.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.get('/api/persons', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    const note = Note.find({}).then(notes => {
      response.json(notes)
      })
    })

    app.get('/info', (req, res) => {
      Note.countDocuments().then(count => {
        const htmlContent = `
          <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
          </div>
        `;
        res.send(htmlContent);
      }).catch(error => {
        console.error('Error fetching count:', error);
        res.status(500).send('Error fetching count');
      });
    });

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})