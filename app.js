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

//---------took out but saved for testing
//JOIN types
//ON beers.type_id = types.id;


app.get('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                beer_id,
                name,
                image,
                brewery,
                alcoholic,
                ABV,
                url_image,
                types.type as type,
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

//_________if the origional beer data has beer type and not type_id, shouldnt this as well?
app.post('/api/beers', async(req, res) => {
    try {
        const result = await client.query(`
            INSERT INTO beers (name, type_id, image, brewery, alcoholic, ABV, url_image)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `,
        // pass the values of the array so that PG.client can sanitize them
        [req.body.name, req.body.typeId, req.body.image, req.body.brewery, req.body.alcoholic, req.body.ABV, req.body.urlImage]
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
            WHERE beers.beer_id = $1
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
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Create file path for updating beers
app.put('/api/beers', async(req, res) => {
    try {
        
        const itemId = req.body.beer_id;
        const result = await client.query(`
            UPDATE beers
            SET name = $1,
                type_id = $2,
                image = $3, 
                brewery = $4, 
                alcoholic = $5, 
                ABV = $6, 
                url_image = $7
            WHERE beer_id = ${itemId};
        `, [req.body.name, req.body.typeId, req.body.image, req.body.brewery, req.body.alcoholic, req.body.ABV, req.body.urlImage]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    } 
});

// Create file path for deleting a beer by its id
app.delete('/api/beer/:id', async(req, res) => {
    try {
        const itemId = req.params.id;
        const result = await client.query(`
        DELETE FROM beers 
        WHERE beer_id = $1
        `, [itemId]);
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

module.exports = { app: app };

