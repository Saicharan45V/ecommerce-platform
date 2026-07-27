import { useEffect, useState } from "react";

function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetching reviews for this specific product
        fetch(`http://localhost:5000/api/reviews/${productId}`)
            .then(response => response.json())
            .then(data => {
                setReviews(data);
            })
            .catch(error => console.error("Error fetching reviews:", error));

    }, [productId]); // FIX 2: Added productId to the dependency array

    return (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h4>Customer Reviews</h4>

            {reviews.length === 0 ? (
                <p style={{ color: '#666' }}>No reviews yet. Be the first!</p>
            ) : (
                <div className="reviews-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {reviews.map((review) => (
                        // FIX 1: Changed key to review.id so it is unique!
                        <div key={review.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            {/* Note: If you do an INNER JOIN on your backend, this can be review.email! */}
                            <strong>User ID: {review.user_id}</strong>
                            <p style={{ margin: '5px 0', color: '#f39c12' }}>
                                ⭐ {review.rating} / 5
                            </p>
                            <p style={{ margin: 0, fontStyle: 'italic' }}>"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductReviews;