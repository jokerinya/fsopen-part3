require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected');
    })
    .catch((error) => {
        console.log(error);
    });

const personSchemea = new mongoose.Schema({
    name: String,
    number: String,
});

personSchemea.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model('Person', personSchemea);

module.exports = Person;
