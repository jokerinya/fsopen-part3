import React from 'react';

const PersonForm = ({
    onFormSubmit,
    newNameValue,
    onNameChange,
    newNumberValue,
    onNumberChange,
    numberFormat,
}) => {
    return (
        <form onSubmit={onFormSubmit}>
            <div>
                name: <input value={newNameValue} onChange={onNameChange} />
            </div>
            <div>
                number:{' '}
                <input value={newNumberValue} onChange={onNumberChange} />
                <br />
                format must bu 0DD-DDDDDDD or 0D-DDDDDDD
                <br />
                your format is {numberFormat ? 'OK' : 'IS NOT OK'}
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>
    );
};

export default PersonForm;
