const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT, role TEXT)");
    db.run("INSERT INTO users VALUES (1, 'admin', 'P@ssw0rd2026_Secure', 'administrator')");
    db.run("CREATE TABLE secrets (id INTEGER, flag TEXT)");
    db.run("INSERT INTO secrets VALUES (1, 'ECC_CTF{SQLi_Login_Bypass_Successful}')");
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>SecureCorp Login</title></head>
        <body style="font-family: sans-serif; display: flex; justify-content: center; margin-top: 50px;">
            <form action="/login" method="POST" style="border: 1px solid #ccc; padding: 20px; border-radius: 5px;">
                <h3>Staff Portal</h3>
                <div><input type="text" name="username" placeholder="Username" style="margin-bottom: 10px;"></div>
                <div><input type="password" name="password" placeholder="Password" style="margin-bottom: 10px;"></div>
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (row) {
            db.get("SELECT flag FROM secrets", (err, secretRow) => {
                res.send(`<h1>Access Granted</h1><p>Welcome, ${row.username}. Flag: <b>${secretRow.flag}</b></p>`);
            });
        } else {
            res.status(401).send("<h1>Invalid Credentials</h1><a href='/'>Back</a>");
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
