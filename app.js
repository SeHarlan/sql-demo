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
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
// Create file path for getting all beers
app.get('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
                FROM beers
            JOIN types
                ON beers.type_id = types.id;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Create file path for adding a beer to node server
app.post('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`
            INSERT INTO beers (name, type_id, image, brewery, alcoholic, ABV, url_image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `,
            // pass the values of the array so that PG.client can sanitize them
        [req.name, req.typeId, req.image, req.brewery, req.alcoholic, req.ABV, req.urlImage]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Create file path for getting a beer by id
app.get('/api/beer/:id', async(req, res) => {
    try {
        const itemId = req.params.id;
        const result = await client.query(`
            SELECT *
            FROM beers
            WHERE id=$1
        `, [itemId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Create file path for getting beers by type
app.get('/api/types', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT * 
            FROM types
            ORDER BY type
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('*', (req, res) => {
    res.json({ home: 'page' });
});

// http method and path...
module.exports = { app: app };

