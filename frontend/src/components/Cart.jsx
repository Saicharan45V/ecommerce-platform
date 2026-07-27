import { useState, useEffect } from 'react';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [authError, setAuthError] = useState("");

    // NEW: State to hold the delivery address
    const [address, setAddress] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please log in to view your cart.");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Invalid or expired token. Please log in again.");
                }
                return res.json();
            })
            .then((data) => setCartItems(data))
            .catch((err) => setAuthError(err.message));

    }, []);

    // NEW: The Checkout Function
    const handleCheckout = async () => {
        // Enforce address requirement
        if (!address.trim()) {
            alert("Please enter your delivery address before checking out.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address: address })
            });

            if (response.ok) {
                alert(`Checkout successful! Your items will be shipped to: ${address}`);
                setCartItems([]); // Empty the cart on the screen instantly
                setAddress("");   // Clear the address box
            } else {
                alert("Checkout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    const removeItem = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`Your cart item with ID=${id} is Removed!`);
                setCartItems(cartItems.filter(item => item.cart_item_id !== id));
            } else {
                alert('Removal failed try again!');
            }
        } catch (error) {
            console.error("Error during removal of cart item:", error);
        }
    }

    const addItem = async (id, item_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`Your cart item quntity added by 1 successfully!`);
                setCartItems(cartItems.map((item) => { if (item.cart_item_id === item_id) { return { ...item, quantity: item.quantity + 1 }; } else { return item; } }))
            } else {
                alert('Adding quantity failed');
            }


        } catch (error) {
            console.error("Error during removal of cart item:", error);
        }
    }

    return (
        <div className="Cart" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2><strong>My Cart</strong></h2>
            <br />

            {authError ? (
                <p style={{ color: 'red' }}>{authError}</p>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {cartItems.map((item) => (
                            <li key={item.cart_item_id} className="cart-card">
                                {/* Column 1: Image */}
                                <div className="cart-image-container">
                                    <img src={item.img_url} alt={item.name} className="cart-image" />
                                </div>

                                {/* Column 2: Product Details */}
                                <div className="cart-details">
                                    <h3 className="cart-product-name">{item.name}</h3>
                                    <p className="cart-stock-status">In Stock</p>
                                    <p className="cart-quantity-text">
                                        Quantity: <strong>{item.quantity}</strong>
                                    </p>
                                    <div className="cart-buttons">
                                        <button className="amazon-btn-secondary" onClick={() => addItem(item.product_id, item.cart_item_id)}>Add 1 More</button>
                                        <span className="divider">|</span>
                                        <button className="amazon-link-btn" onClick={() => removeItem(item.cart_item_id)}>Delete</button>
                                    </div>
                                </div>

                                {/* Column 3: Total Price */}
                                <div className="cart-price-column">
                                    <p className="cart-price">₹{item.price * item.quantity}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <br />

                    {/* NEW: Address Input and Checkout Button UI */}
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea
                            placeholder="Enter your full delivery address here..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                        />
                        <button
                            className="add-to-cart-btn"

                            onClick={handleCheckout}
                        >
                            Checkout Now
                        </button>
                    </div>
                </>
            )}
        </div >
    );
}

export default Cart;