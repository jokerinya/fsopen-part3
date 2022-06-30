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
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            // `0D-DDDDDDD`, `0DD-DDDDDDD` format
            validator: function (v) {
                return /0[0-9]{1,2}-[0-9]{7,}/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: [true, 'User phone number required'],
    },
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
