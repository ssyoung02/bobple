import React from 'react';

function PointShopList({ pointShops = [] }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Gift Index</th>
                <th>Gift Category</th>
                <th>Gift Brand</th>
                <th>Gift Description</th>
                <th>Gift Point</th>
                <th>Gift Image URL</th>
            </tr>
            </thead>
            <tbody>
            {pointShops.map(shop => (
                <tr key={shop.giftIdx}>
                    <td>{shop.giftIdx}</td>
                    <td>{shop.giftCategory}</td>
                    <td>{shop.giftBrand}</td>
                    <td>{shop.giftDescription}</td>
                    <td>{shop.giftPoint}</td>
                    <td><img src={shop.giftImageUrl} alt="Gift" style={{ width: '100px' }} /></td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default PointShopList;
