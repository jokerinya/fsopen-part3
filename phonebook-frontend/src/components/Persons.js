import React from 'react';
import Person from './Person';

const Persons = ({ persons, onDeletePerson }) => {
    return (
        <>
            {persons.map((person) => (
                <Person
                    key={person.id}
                    person={person}
                    onDeletePerson={() => onDeletePerson(person.id)}
                />
            ))}
        </>
    );
};

export default Persons;
