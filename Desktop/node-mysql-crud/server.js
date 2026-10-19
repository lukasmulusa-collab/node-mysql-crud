const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import single db instance (ensure db.js exports a promise-based pool/connection)
const db = require('./db.js');

const app = express();

app.use(cors());
app.use(express.json());

// Root path so Render health checks load instantly
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

const RESOURCE = 'portfolio';

// TEMPORARY DB MIGRATION ROUTE: Adds missing columns to Aiven MySQL table
app.get('/api/fix-db', async (req, res) => {
  try {
    await db.query(`
      ALTER TABLE ${RESOURCE} 
      ADD COLUMN owner_name VARCHAR(255),
      ADD COLUMN category VARCHAR(255),
      ADD COLUMN skills VARCHAR(255)
    `);
    res.send("Columns added successfully!");
  } catch (err) {
    res.status(500).send("DB Fix Status: " + err.message);
  }
});

// 1. GET ALL
app.get(`/api/${RESOURCE}`, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${RESOURCE}`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ONE BY ID
app.get(`/api/${RESOURCE}/:id`, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${RESOURCE} WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST CREATE
app.post(`/api/${RESOURCE}`, async (req, res) => {
  const { title, category, skills, project_url } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO ${RESOURCE} (title, category, skills, project_url) VALUES (?, ?, ?, ?)`,
      [title, category, skills, project_url]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT UPDATE
app.put(`/api/${RESOURCE}/:id`, async (req, res) => {
  const { title, category, skills, project_url } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE ${RESOURCE} SET title=?, category=?, skills=?, project_url=? WHERE id=?`,
      [title, category, skills, project_url, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE
app.delete(`/api/${RESOURCE}/:id`, async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM ${RESOURCE} WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));