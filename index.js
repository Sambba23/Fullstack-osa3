const express = require('express')
const app = express()

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
]


app.get('/api/persons', (req, res) => {
res.json(notes)
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