import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem('token', data.token);


                navigate('/');

                window.location.reload();
            } else {
                setError(data.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2>Welcome Back</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
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
                <button type="submit" className="add-to-cart-btn" style={{ backgroundColor: '#27ae60' }}>Log In</button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
}

export default Login;