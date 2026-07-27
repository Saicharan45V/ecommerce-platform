const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('./db');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/server', (req, res) => {
    res.json({ message: "Server is running properly" });
});

app.get('/api/products', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM products');
        res.json(data.rows);
        console.log("GET route is running successfully!");
    } catch (error) {
        console.log("Error occured!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/api/auth/signup', async (req, res) => {
    try {
        const email = req.body.email;
        const plainPassword = req.body.password;
        const data = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (data.rows.length > 0) {
            return res.status(400).json({ message: "You have already registered through this email" });
        }

        const password_hash = await bcrypt.hash(plainPassword, 10);

        await pool.query('INSERT INTO users(email,password_hash) VALUES ($1,$2)', [email, password_hash]);
        res.status(201).json({ message: "Signup successful!" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const email = req.body.email;
        const plainPassword = req.body.password;
        const data = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (data.rows.length === 0) {
            return res.status(401).json({ message: "Invalid cardinals Error!" });
        }
        const validPassword = await bcrypt.compare(plainPassword, data.rows[0].password_hash);
        if (validPassword) {
            const token = jwt.sign(
                { user_id: data.rows[0].id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: "You LOGGED IN successfully!", token: token });
        } else {
            res.status(401).json({ message: "Invalid cardinals Error!" });
        }


    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Please log in." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        req.user = decodedUser;
        next();
    });
};


app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const query = `
            SELECT cart_items.id AS cart_item_id, products.id AS product_id, products.name, products.price, products.img_url, cart_items.quantity 
            FROM cart_items 
            INNER JOIN products ON cart_items.product_id = products.id
            WHERE cart_items.user_id = $1
        `;
        const data = await pool.query(query, [userId]);
        res.json(data.rows);
    } catch (error) {
        console.error("Error fetching cart!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { product_id } = req.body;
        const userId = req.user.user_id;


        const result = await pool.query(
            'SELECT * FROM cart_items WHERE product_id=$1 AND user_id=$2',
            [product_id, userId]
        );

        if (result.rows.length > 0) {

            await pool.query(
                'UPDATE cart_items SET quantity=quantity+1 WHERE product_id=$1 AND user_id=$2',
                [product_id, userId]
            );
        } else {

            await pool.query(
                'INSERT INTO cart_items (product_id, quantity, user_id) VALUES ($1, 1, $2)',
                [product_id, userId]
            );
        }
        res.json({ message: "Cart updated" });
    } catch (error) {
        console.error("Error updating cart!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const userId = req.user.user_id;


        await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cartItemId, userId]);
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing item!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/checkout', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: "Delivery address is required!" });
        }
        const cartData = await pool.query('SELECT * FROM cart_items WHERE user_id=$1', [userId]);
        if (cartData.rows.length === 0) {
            return res.status(400).json({ message: "Your cart is empty!" });
        }
        const orderResult = await pool.query(
            'INSERT INTO orders(user_id, address) VALUES ($1, $2) RETURNING *',
            [userId, address]
        );
        const newOrderId = orderResult.rows[0].id;
        for (let item of cartData.rows) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [newOrderId, item.product_id, item.quantity]
            );
        }
        await pool.query('DELETE FROM cart_items WHERE user_id=$1', [userId]);
        res.json({ message: "Checkout successful!", order_id: newOrderId });
    } catch (error) {
        console.log("Error occured during check out!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const productId = req.body.product_id;
        const rating = req.body.rating;
        const comment = req.body.comment;

        const data = await pool.query('SELECT * FROM orders INNER JOIN order_items ON orders.id = order_items.order_id WHERE orders.user_id = $1 AND order_items.product_id = $2', [userId, productId]);
        if (data.rows.length === 0) {
            return res.status(403).json({ message: "YOU must purchase item before reviewing it!" });
        }
        await pool.query('INSERT INTO reviews(user_id,product_id,rating,comment) VALUES ($1,$2,$3,$4)', [userId, productId, rating, comment]);
        res.json({ message: "Review added successfully!" });
    } catch (error) {
        console.log("Error occured during review!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "No such item found!" });
        }
        res.json(data.rows[0]);

    } catch (error) {
        console.log("Error occured during get details of product route!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.delete('/api/cart/remove/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const id = req.params.id;

        await pool.query('DELETE FROM cart_items WHERE user_id=$1 AND id=$2', [userId, id]);
        res.json({ message: "Item deleted successfully from cart!" });

    } catch (error) {
        console.log("Error occured during removing item from cart!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post('/api/cart/add/:product', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const product_id = req.params.product;

        await pool.query('UPDATE cart_items SET quantity=quantity+1 WHERE product_id=$1 AND user_id=$2', [product_id, userId]);

        res.json({ message: "Item quantity increased in cart successfully!" });


    } catch (error) {
        console.log("Error occured during adding item from cart!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const data = await pool.query('SELECT * FROM orders INNER JOIN order_items ON orders.id = order_items.order_id INNER JOIN products ON order_items.product_id = products.id WHERE orders.user_id = $1', [userId]);

        if (data.rows.length === 0) {
            return res.json({ message: "There are no previous orders!" });
        }
        res.json(data.rows);
    } catch (error) {
        console.log("Error occured during retriving my orders!", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

const port = 5000;
app.listen(port, () => {
    console.log(`server running successfully in http://localhost:${port}`);
});