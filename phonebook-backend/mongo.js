const mongoose = require('mongoose');
require('dotenv').config();

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password> <name> <number>'
    );
    console.log('To print phone book enter: node mongo.js <password>');
    process.exit(1);
}

const [password, name, number] = process.argv.slice(2);

const url = process.env.MONGODB_URI;

const personSchemea = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchemea);

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected');
        if (name && number) {
            const person = new Person({
                name,
                number,
            });
            return person.save().then((person) => {
                console.log(
                    `added ${person.name} number ${person.number} to phonebook`
                );
                mongoose.connection.close();
            });
        }
        // write phonebook
        console.log('phonebook:');
        Person.find({}).then((persons) => {
            persons.map((person) => console.log(person.name, person.number));
            mongoose.connection.close();
        });
    })
    .catch((error) => {
        console.log(error);
    });
