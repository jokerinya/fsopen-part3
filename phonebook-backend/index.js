const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const generateId = () => Math.random().toString().substring(2);
// custom token for loging in morgan
morgan.token('postData', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
});
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
];
/* Middlewares */
app.use(express.json()); // json parser
// logging tokens in morgan
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :postData'
    )
);
app.use(cors());

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.get('/api/v1/persons', (request, response) => {
    response.status(200).json(persons);
});

app.get('/api/v1/persons/:id', (request, response) => {
    const id = +request.params.id;
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.statusMessage = 'There is not a user with this id number';
        response.status(404).end();
    }
});

app.delete('/api/v1/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.post('/api/v1/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        const missing = !!body.name ? 'Name' : 'Number';
        return response.status(400).json({ error: `'${missing}' is missing` });
    }

    const exist = persons.find((p) => p.name === body.name);
    if (exist) {
        return response.status(400).json({ error: 'name must be uniqe' });
    }

    const person = {
        name: body.name,
        id: generateId(),
        number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server listening ${PORT}`);
