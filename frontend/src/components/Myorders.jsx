import { useState, useEffect } from "react";

function Myorders() {
    const [orders, setOrders] = useState([]);
    const [authError, setAuthError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            setAuthError("Please log in to view your cart.");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setOrders([]);
                } else {
                    setOrders(data);
                }

            })
            .catch((err) => setAuthError(err.message));
    }, [])

    return (
        <div className="Cart" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2><strong>My Orders</strong></h2><br />
            {authError ? (
                <p style={{ color: 'red' }}>{authError}</p>
            ) : orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                <>
                    <ul className="order-list">
                        {orders.map((order, index) => (
                            <li key={index} className="order-card">
                                <img src={order.img_url} alt={order.name} className="order-image" />

                                <div className="order-details">
                                    <p className="order-name"><strong>{order.name}</strong></p>
                                    <p>Quantity: {order.quantity}</p>
                                    <p className="order-cost">Total Cost: <strong>₹{order.quantity * order.price}</strong></p>
                                    <p className="order-address">Delivery to: {order.address}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

        </div>
    )
}

export default Myorders;