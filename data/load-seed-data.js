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

        const savedTypes = await Promise.all(
            types.map(async type => {
                const result = await client.query(`
                        INSERT INTO types (type)
                        VALUES ($1)
                        RETURNING *;
                    `, [type]);
                return result.rows[0];
            })
        );
        await Promise.all(
            // for every beer data, we want a promise to insert into the db
            beers.map(beer => {
                const type = savedTypes.find(type => {
                    return type.type === beer.type;
                });
               
                return client.query(`
                    INSERT INTO beers (name, type_id, image, brewery, alcoholic, ABV, url_image)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                    
                [beer.name, type.id, beer.image, beer.brewery, beer.alcoholic, beer.ABV, beer.urlImage]);
                
                
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