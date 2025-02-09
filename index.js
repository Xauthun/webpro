const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('userdata.db', (err) => {    
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.get('/', (req, res) => {
    db.all('SELECT * FROM users', [], (err, result) => {
        if (err) {
            console.log('Error fetching users');
            return res.status(500).send('Error fetching users');
        }
        res.render('users', { users: result, detail: null }); // ส่งค่า detail เป็น null เมื่อยังไม่มีผู้ใช้ที่ถูกเลือก
    });
});

app.post('/detail/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.log('Error fetching user details');
            return res.status(500).send('Error fetching user details');
        }

        db.all('SELECT * FROM users', [], (err, users) => {
            if (err) {
                console.log('Error fetching users');
                return res.status(500).send('Error fetching users');
            }
            res.render('users', { users: users, detail: result });
        });
    });
});

// static resources & templating engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
