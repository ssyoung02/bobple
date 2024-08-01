// src/components/PointShopForm.js
import React, { useState } from 'react';
import axios from 'axios';

function PointShopForm() {
    const [formData, setFormData] = useState({
        giftCategory: '',
        giftBrand: '',
        giftDescription: '',
        giftPoint: '',
        giftImageUrl: ''
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

        axios.post('http://localhost:8080/api/point-shops/upload', formDataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const imageUrl = response.data;
                axios.post('http://localhost:8080/api/point-shops', { ...formData, giftImageUrl: imageUrl }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        alert('Point shop item added successfully!');
                        setFormData({
                            giftCategory: '',
                            giftBrand: '',
                            giftDescription: '',
                            giftPoint: '',
                            giftImageUrl: ''
                        });
                        setFile(null);
                    })
                    .catch(error => {
                        console.error("There was an error adding the point shop item!", error);
                    });
            })
            .catch(error => {
                console.error("There was an error uploading the file!", error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Gift Category:
                <input type="text" name="giftCategory" value={formData.giftCategory} onChange={handleChange} />
            </label>
            <br />
            <label>
                Gift Brand:
                <input type="text" name="giftBrand" value={formData.giftBrand} onChange={handleChange} />
            </label>
            <br />
            <label>
                Gift Description:
                <input type="text" name="giftDescription" value={formData.giftDescription} onChange={handleChange} />
            </label>
            <br />
            <label>
                Gift Point:
                <input type="number" name="giftPoint" value={formData.giftPoint} onChange={handleChange} />
            </label>
            <br />
            <label>
                Gift Image:
                <input type="file" name="giftImage" onChange={handleFileChange} />
            </label>
            <br />
            <button type="submit">Add Point Shop Item</button>
        </form>
    );
}

export default PointShopForm;
