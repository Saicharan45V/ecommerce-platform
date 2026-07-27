import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Signup successful! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage(data.message || "Signup failed.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2>Create an Account</h2>
            {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" className="add-to-cart-btn">Sign Up</button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Log in here</Link>
            </p>
        </div>
    );
}

export default Signup;