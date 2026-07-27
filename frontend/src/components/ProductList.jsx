import { useNavigate, Link } from 'react-router-dom';



function ProductsList({ products = [] }) {
    const navigate = useNavigate();
    const safeProducts = products;

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

    return (
        <div className="products-section">
            <h2>Our Products</h2>
            {safeProducts.length === 0 ? (
                <p>Loading products...</p>
            ) : (
                <div className="product-grid">
                    {safeProducts.map((product) => (
                        <div className="product-card" key={product.id}>
                            {/* Make the image and title clickable */}
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img className="product-img" src={product.img_url} alt={product.name} />
                                <h3>{product.name}</h3>
                            </Link>

                            <p className="product-price">₹{product.price}</p>

                            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product.id)}>
                                Add to Cart
                            </button>


                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductsList;