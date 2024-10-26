const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

// เชื่อมต่อฐานข้อมูล
let db = new sqlite3.Database('userdata.db', (err) => {    
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Route สำหรับแสดงรายการผู้ใช้ทั้งหมด
app.get('/', (req, res) => {
    db.all('SELECT * FROM users', [], (err, result) => {
        if (err) {
            console.log('Error fetching users');
            return res.status(500).send('Error fetching users');
        }
        res.render('users', { users: result, detail: null }); // ส่งค่า detail เป็น null เมื่อยังไม่มีผู้ใช้ที่ถูกเลือก
    });
});

// Route สำหรับแสดงรายละเอียดผู้ใช้เมื่อกดปุ่ม "Detail"
app.post('/detail/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.log('Error fetching user details');
            return res.status(500).send('Error fetching user details');
        }

        // ดึงข้อมูลผู้ใช้ทั้งหมดพร้อมแสดงรายละเอียดของผู้ใช้ที่เลือก
        db.all('SELECT * FROM users', [], (err, users) => {
            if (err) {
                console.log('Error fetching users');
                return res.status(500).send('Error fetching users');
            }
            res.render('users', { users: users, detail: result }); // ส่งค่า detail เป็นข้อมูลของผู้ใช้ที่เลือก
        });
    });
});

// static resources & templating engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
