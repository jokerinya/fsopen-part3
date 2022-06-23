import React from 'react';

const PersonForm = ({
    onFormSubmit,
    newNameValue,
    onNameChange,
    newNumberValue,
    onNumberChange,
}) => {
    return (
        <form onSubmit={onFormSubmit}>
            <div>
                name: <input value={newNameValue} onChange={onNameChange} />
            </div>
            <div>
                number:{' '}
                <input
                    value={newNumberValue}
                    onChange={onNumberChange}
                    type='number'
                />
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>
    );
};

export default PersonForm;
