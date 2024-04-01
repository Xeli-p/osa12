const mongoose = require('mongoose')
const parAmount = process.argv.length


if (parAmount<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://xxxxx:${password}@cluster1.gfdijn0.mongodb.net/notes?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Note = mongoose.model('Note', noteSchema)


if (parAmount === 3) {
    console.log('Phonebook:')

    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(`${note.name}  ${note.phone}`)
            mongoose.connection.close()
        })
    })
}

if (parAmount === 5) {
    const note = new Note({
        name: process.argv[3],
        phone: process.argv[4]
    })

    note.save().then(result => {
        console.log(`added ${result.name} number ${result.phone} to phonebook`)
        mongoose.connection.close()
    })
}
