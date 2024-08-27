import React from 'react';

function WishlistProduct({ product, productRemove }) {
    return (
        <div className="p-4 mb-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            <button
                onClick={() => productRemove(product.id)}
                className="mt-2 text-red-500 hover:text-red-700"
            >
                Remove from wishlist
            </button>
        </div>
    );
}

export default WishlistProduct;