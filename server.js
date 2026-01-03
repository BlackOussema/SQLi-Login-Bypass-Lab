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
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Ghariani Oussema | Security Lab</title>
            <style>
                body {
                    margin: 0; padding: 0;
                    background: #050801;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex; justify-content: center; align-items: center; height: 100vh;
                }
                .login-box {
                    width: 400px; padding: 40px;
                    background: rgba(0,0,0,.5);
                    box-sizing: border-box;
                    box-shadow: 0 15px 25px rgba(0,0,0,.6);
                    border-radius: 10px; border: 1px solid #03e9f4;
                }
                .login-box h2 {
                    margin: 0 0 30px; padding: 0;
                    color: #fff; text-align: center; text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .user-box { position: relative; }
                .user-box input {
                    width: 100%; padding: 10px 0;
                    font-size: 16px; color: #fff; margin-bottom: 30px;
                    border: none; border-bottom: 1px solid #fff;
                    outline: none; background: transparent;
                }
                .user-box label {
                    position: absolute; top:0; left: 0;
                    padding: 10px 0; font-size: 16px; color: #fff;
                    pointer-events: none; transition: .5s;
                }
                .user-box input:focus ~ label, .user-box input:valid ~ label {
                    top: -20px; left: 0; color: #03e9f4; font-size: 12px;
                }
                button {
                    background: transparent; border: none;
                    position: relative; display: inline-block;
                    padding: 10px 20px; color: #03e9f4;
                    font-size: 16px; text-decoration: none;
                    text-transform: uppercase; overflow: hidden;
                    transition: .5s; margin-top: 40px; letter-spacing: 4px;
                    cursor: pointer; width: 100%;
                }
                button:hover {
                    background: #03e9f4; color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
                }
                footer {
                    position: absolute; bottom: 20px; color: #03e9f4;
                    font-size: 14px; letter-spacing: 1px;
                }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h2>Security Portal</h2>
                <form action="/login" method="POST">
                    <div class="user-box">
                        <input type="text" name="username" required="">
                        <label>Username</label>
                    </div>
                    <div class="user-box">
                        <input type="password" name="password">
                        <label>Password</label>
                    </div>
                    <button type="submit">Access System</button>
                </form>
            </div>
            <footer>Created by: Ghariani Oussema</footer>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send("<html><body style='background:#050801;color:red;font-family:monospace;'>[SYSTEM ERROR]: " + err.message + "</body></html>");
        } else if (row) {
            db.get("SELECT flag FROM secrets", (err, secretRow) => {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>Dashboard</title></head>
                    <body style="background: #050801; color: #03e9f4; font-family: 'Courier New', monospace; padding: 50px;">
                        <div style="border: 2px solid #03e9f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px #03e9f4;">
                            <h1>[+] ACCESS GRANTED - WELCOME ${row.username.toUpperCase()}</h1>
                            <hr style="border-color: #03e9f4;">
                            <p>> User Role: ${row.role}</p>
                            <p>> System Status: Online</p>
                            <p style="background: #03e9f4; color: #000; padding: 10px; display: inline-block;">
                                [CRITICAL DATA FOUND]: ${secretRow.flag}
                            </p>
                        </div>
                    </body>
                    </html>
                `);
            });
        } else {
            res.send(`<html><body style='background:#050801;color:white;text-align:center;padding-top:100px;font-family:sans-serif;'>
                <h1 style='color:red;'>ACCESS DENIED</h1>
                <a href='/' style='color:#03e9f4;'>Return to Login</a>
            </body></html>`);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server online`));
