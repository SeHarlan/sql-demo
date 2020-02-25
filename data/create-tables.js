// load connection string from .env
require('dotenv').config();
// "require" pg (after `npm i pg`)
const pg = require('pg');
// Use the pg Client
const Client = pg.Client;
// **note:** you will need to create the database!

// async/await needs to run in a function
run();

async function run() {
    // make a new pg client to the supplied url
    const client = new Client(process.env.DATABASE_URL);

    try {
        // initiate connecting to db
        await client.connect();
    
        // run a query to create tables
        await client.query(`
            CREATE TABLE types (
                id SERIAL PRIMARY KEY NOT NULL,
                type VARCHAR(256) NOT NULL
            );
            
            CREATE TABLE beers (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(256) NOT NULL,
                type_id INTEGER NOT NULL REFERENCES types(id),
                image VARCHAR(256) NOT NULL,
                brewery VARCHAR(256) NOT NULL,
                alchoholic BOOLEAN NOT NULL,
                ABV FLOAT NOT NULL,
                url_image BOOLEAN NOT NULL
            );
        `);

    }
    catch (err) {
        // problem? let's see the error...
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }
    
}