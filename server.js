require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Phục vụ trực tiếp index.html và style.css trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Tạo kết nối Pool tới MySQL từ biến môi trường
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'slime_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'slime_coffee',
  waitForConnections: true,
  connectionLimit: 10
});

// Tự động kiểm tra kết nối và đảm bảo bảng orders đã tồn tại
async function initMySQL() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL UNIQUE,
        items JSON NOT NULL,
        total_amount INT NOT NULL,
        created_at VARCHAR(50) NOT NULL,
        status VARCHAR(30) DEFAULT 'SUCCESS'
      )
    `);
    connection.release();
    console.log('✓ Đã kết nối MySQL thành công và sẵn sàng bảng orders!');
  } catch (err) {
    console.error('✗ Lỗi kết nối MySQL:', err.message);
  }
}

// Endpoint kiểm tra trạng thái hệ thống & MySQL (Health Check)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'MySQL Connected' });
  } catch (err) {
    res.status(503).json({ status: 'DOWN', error: err.message });
  }
});

// 1. API ĐỌC LỊCH SỬ ĐƠN HÀNG TỪ MYSQL (READ)
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT order_id AS orderId, items, total_amount AS totalAmount, created_at AS createdAt, status
       FROM orders
       ORDER BY id DESC`
    );
    res.status(200).json({ orders: rows });
  } catch (err) {
    console.error('Lỗi đọc MySQL:', err.message);
    res.status(500).json({ error: 'Không thể tải lịch sử đơn hàng từ MySQL.' });
  }
});

// 2. API LƯU ĐƠN HÀNG MỚI VÀO MYSQL (WRITE)
app.post('/api/orders', async (req, res) => {
  const { orderId, items, totalAmount, createdAt, status } = req.body;

  if (!orderId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Dữ liệu đơn hàng không hợp lệ.' });
  }

  try {
    await pool.query(
      `INSERT INTO orders (order_id, items, total_amount, created_at, status)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, JSON.stringify(items), Number(totalAmount), createdAt, status || 'SUCCESS']
    );

    res.status(201).json({
      message: 'Đã lưu đơn hàng vào MySQL thành công!',
      order: { orderId, items, totalAmount, createdAt, status: status || 'SUCCESS' }
    });
  } catch (err) {
    console.error('Lỗi ghi MySQL:', err.message);
    res.status(500).json({ error: 'Không thể lưu đơn hàng vào cơ sở dữ liệu MySQL.' });
  }
});

initMySQL().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Slime Coffee Server đang chạy tại http://localhost:${PORT}`);
  });
});