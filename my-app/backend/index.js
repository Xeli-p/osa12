require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log(error.message)
        return response.status(400).json({ error: error.message })
    }

    next(error)
}


morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'))
app.use(cors())
app.use(express.static('dist'))
app.use(errorHandler)

app.set('json spaces', 4)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response,next) => {
    Note.find({}).then(notes => {
        response.json(notes)
    }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { name, phone } = request.body

    Note.findByIdAndUpdate(request.params.id, { name, phone }, { runValidators: true, context:'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        }).catch(error => {
            next(error)
        })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            console.log()
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        }).catch(error => next(error))
})

app.post('/api/notes', (request, response,next) => {
    const body = request.body

    if (body.name === undefined) {

        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        name: body.name,
        phone: body.phone
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})


app.get('/info', (req, res,next) => {
    const time = new Date()
    time.getTime()

    Note.find({}).then(notes => {
        const resp = `<p>Phonebook has info for ${notes.length} people</p> <p>${time}</p> `
        res.send(resp)
    }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
