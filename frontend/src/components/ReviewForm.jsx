import { useState } from "react";

function ReviewForm({ productId }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState(''); // FIX 1: Use useState
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage("Please log in to leave a review.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: productId, rating: rating, comment: comment })
            });

            // FIX 4: Read the response from the backend
            const data = await response.json();

            if (response.ok) {
                setMessage("Review added successfully!");
                setComment(''); // Clear the text box after success
            } else {
                setMessage(data.message); // Displays the backend bouncer error
            }

        } catch (error) {
            console.error('Error occurred!', error);
            setMessage("Server error. Please try again.");
        }
    };
    // FIX 2: handleSubmit ends here!

    // FIX 2: return is outside the function
    return (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <h4>Leave a Review</h4>

            {/* Display our success or error message */}
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* FIX 3: Use onChange for selects */}
                <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '5px' }}>
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                </select>

                {/* FIX 3: Use onChange for inputs/textareas */}
                <textarea
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                {/* FIX 3: onClick for buttons */}
                <button onClick={handleSubmit} className="add-to-cart-btn">Submit Review</button>
            </div>
        </div>
    );
}

export default ReviewForm;