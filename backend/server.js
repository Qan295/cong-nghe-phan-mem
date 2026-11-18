const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Gọi file kết nối database vừa tạo
const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route kiểm tra server hoạt động
app.get('/', (req, res) => {
    res.send('Backend Smart Heritage đang chạy!');
});

// Route kiểm tra lấy dữ liệu từ bảng roles trong database
app.get('/api/roles', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roles');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});