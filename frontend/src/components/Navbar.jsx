import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    // Check if the user is currently logged in
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        // 1. Destroy the token
        localStorage.removeItem('token');

        // 2. Redirect the user to the login page
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">Techstore <strong style={{ color: "red" }}>Mini</strong></div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>

                {/* Only show "My Orders" if they are logged in */}
                {token && <li><Link to="/orders">My Orders</Link></li>}

                {/* Dynamically swap Login and Logout */}
                {token ? (
                    <li>
                        <button onClick={handleLogout} className="logout-btn" >
                            Logout
                        </button>
                    </li>
                ) : (
                    <li><Link to="/login">Login/Signup</Link></li>
                )}

                <li><Link to="/cart" className="nav-cart-btn">My Cart</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;