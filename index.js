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


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


app.post('/api/persons', (request, response) => {
  const body = request.body
  
  const note = new Note({
    name: body.name,
    number: body.number, 
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'Document not found' });
      }
    })
    .catch(error => next(error))
});


app.get('/api/persons', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
Note.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Note.countDocuments().then(count => {
    const htmlContent = `
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      </div>
    `;
    res.send(htmlContent);
  }) 
  .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number, 
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})