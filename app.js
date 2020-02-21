// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

// Database Client
const Client = pg.Client;
// (create and connect using DATABASE_URL)
const client = new Client(process.env.DATABASE_URL);
client.connect();

// Application Setup
// (add middleware utils: logging, cors, static files from public)
const app = express();
app.use(morgan('dev'));
app.use(cors());

// API Routes
app.get('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM beers;
        `);
        console.log('result.rows', result.rows);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// http method and path...
exports.module = { app: app };

