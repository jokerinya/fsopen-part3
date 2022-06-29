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

app.get('/info', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `);
        })
        .catch((error) => next(error));
});

app.get('/api/v1/persons', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.status(200).json(persons);
        })
        .catch((error) => next(error));
});

app.get('/api/v1/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => {
            response.status(200).json(person);
        })
        .catch((error) => next(error));
});

app.delete('/api/v1/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then((person) => {
            if (!person) {
                response.status(400).send(id + ' was not found');
            } else {
                response.status(204).send(`${person.name} was deleted.`);
            }
        })
        .catch((error) => next(error));
});

app.post('/api/v1/persons', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        const missing = !!name ? 'Number' : 'Name';
        return response.status(400).json({ error: `'${missing}' is missing` });
    }

    Person.findOne({ name: name })
        .then((person) => {
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
        })
        .catch((error) => next(error));
});

app.put('/api/v1/persons/:id', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        const missing = !!name ? 'Number' : 'Name';
        return response.status(400).json({ error: `'${missing}' is missing` });
    }

    const person = { name, number };

    // {new: true} provides us the updatedNote instead of oldNote
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            console.log(updatedPerson);
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

/* Put it at the end of the routes */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler', error.message);
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};
// this has to be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening ${PORT}`);
