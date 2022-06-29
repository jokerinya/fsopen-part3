const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

const app = express();

const generateId = () => Math.random().toString().substring(2);
// custom token for loging in morgan
morgan.token('postData', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
});
// let persons = [
//     {
//         id: 1,
//         name: 'Arto Hellas',
//         number: '040-123456',
//     },
//     {
//         id: 2,
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//     },
//     {
//         id: 3,
//         name: 'Dan Abramov',
//         number: '12-43-234345',
//     },
//     {
//         id: 4,
//         name: 'Mary Poppendieck',
//         number: '39-23-6423122',
//     },
// ];
/* Middlewares */
app.use(express.json()); // json parser
// logging tokens in morgan
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :postData'
    )
);
app.use(cors());
app.use(express.static('build'));

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.get('/api/v1/persons', (request, response) => {
    Person.find({})
        .then((persons) => {
            response.status(200).json(persons);
        })
        .catch((error) => response.status(400).json({ error: error.message }));
});

app.get('/api/v1/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => {
            response.status(200).json(person);
        })
        .catch((error) => response.status(404).json({ error: error.message }));
});

app.delete('/api/v1/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then((person) => {
            if (!person) {
                response.status(400).send(id + ' was not found');
            } else {
                response.status(200).send(`${person.name} was deleted.`);
            }
        })
        .catch((err) => {
            console.error(err.message);
            response.status(500).send('Error: ' + err.message);
        });
});

app.post('/api/v1/persons', (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        const missing = !!name ? 'Number' : 'Name';
        return response.status(400).json({ error: `'${missing}' is missing` });
    }

    Person.findOne({ name: name }).then((person) => {
        if (person) {
            response
                .status(400)
                .json({ error: `${person.name} name must be uniqe` });
        } else {
            const person = new Person({
                name: name,
                number: number,
            });
            person.save().then((savedPerson) => response.json(savedPerson));
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening ${PORT}`);
