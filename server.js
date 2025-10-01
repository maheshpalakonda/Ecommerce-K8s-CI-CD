const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'add to cart.html'));
});

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // change if needed
    password: "Vasu@1526",      // your MySQL password
    database: "quickcartdb"
});

db.connect(err => {
    if (err) {
        console.error("DB connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// ==========================
// Customer Registration
// ==========================
app.post("/register/customer", async (req, res) => {
    const { fullname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO customers (fullname, email, password) VALUES (?, ?, ?)",
        [fullname, email, hashedPassword],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json({ message: "Customer registered successfully!" });
        }
    );
});

// ==========================
// Customer Login
// ==========================
app.post("/login/customer", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM customers WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ message: "User not found" });

        const validPass = await bcrypt.compare(password, results[0].password);
        if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ message: "Login successful", user: results[0] });
    });
});

// ==========================
// Seller Registration/Login
// ==========================
app.post("/register/seller", async (req, res) => {
    const { fullname, business_name, business_type, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO sellers (fullname, business_name, business_type, email, password) VALUES (?, ?, ?, ?, ?)",
        [fullname, business_name, business_type, email, hashedPassword],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Seller registered successfully!" });
        }
    );
});

app.post("/login/seller", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM sellers WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ message: "Seller not found" });

        const validPass = await bcrypt.compare(password, results[0].password);
        if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ message: "Login successful", seller: results[0] });
    });
});

// ==========================
// Admin Registration/Login
// ==========================
app.post("/register/admin", async (req, res) => {
    const { fullname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO admins (fullname, email, password) VALUES (?, ?, ?)",
        [fullname, email, hashedPassword],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Admin registered successfully!" });
        }
    );
});

app.post("/login/admin", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ message: "Admin not found" });

        const validPass = await bcrypt.compare(password, results[0].password);
        if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ message: "Admin login successful", admin: results[0] });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
