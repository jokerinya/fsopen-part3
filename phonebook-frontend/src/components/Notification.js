import React from 'react';

const Notification = ({ message }) => {
    if (message.type === null || message.content === null) {
        return null;
    }
    return <div className={message.type}>{message.content}</div>;
};

export default Notification;
