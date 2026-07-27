import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // This grabs the ID from the URL!
import ReviewForm from './ReviewForm';
import ProductReviews from './ProductReviews';

function ProductDetails() {
    // useParams pulls the "id" right out of the browser's address bar
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('token');


        if (!token) {
            alert("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Attach the ID card!
                },
                body: JSON.stringify({ product_id: productId })
            });

            if (response.ok) {
                alert("Item added to your cart!");
            } else {
                alert("Failed to add item to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    useEffect(() => {
        // You will need a backend route to fetch a SINGLE product by its ID
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error("Error fetching product:", err));
    }, [id]);

    if (!product) return <p>Loading product details...</p>;

    return (
        <div className="product-details-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

            {/* 1. The Product Info Section */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                <img src={product.img_url} alt={product.name} style={{ width: '300px', objectFit: 'cover' }} />
                <div>
                    <h2>{product.name}</h2>
                    <h3 style={{ color: '#b12704' }}>₹{product.price}</h3>
                    <p>{product.description}</p>
                    <br />
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product.id)}>
                        Add to Cart
                    </button>
                </div>
            </div>

            <hr />

            {/* 2. The Reviews Section (Amazon Style!) */}
            <div className="reviews-section" style={{ marginTop: '30px' }}>
                <h3>Customer Reviews</h3>

                {/* Drop your two components right here */}
                <ReviewForm productId={id} />
                <ProductReviews productId={id} />
            </div>

        </div>
    );
}

export default ProductDetails;