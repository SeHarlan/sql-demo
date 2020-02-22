require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import our seed data:
const beers = require('./beers.js');
const types = require('./types.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // for every cat data, we want a promise to insert into the db
            beers.map(beer => {

                return client.query(`
                    INSERT INTO beers (name, type_id, image, brewery, alchoholic, ABV, url_image)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                    
                [beer.name, beer.typeId, beer.image, beer.brewery, beer.alchoholic, beer.ABV, beer.urlImage]);

            }),
            types.map(type => {
                return client.query(`
                        INSERT INTO types (type)
                        VALUES ($1);
                    `, [type]);
            })    
        );


        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}