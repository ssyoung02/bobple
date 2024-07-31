import React, { useState, useEffect } from 'react';

const GroupModalTest = ({ isOpen, onClose }) => {
    const [charCountTitle, setCharCountTitle] = useState(0);
    const [charCountDescription, setCharCountDescription] = useState(0);
    const [charCountLocation, setCharCountLocation] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

};

export default GroupModalTest;
