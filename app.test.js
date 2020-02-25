const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /api/beers', () => {
    test('It should respond with an object of the correct shape',
    
        async(done) => {
            
            const response = await request(app).get('/api/beers');
         
            expect(response.body[0]).toEqual(
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    type: expect.any(String),
                    image: expect.any(String),
                    brewery: expect.any(String),
                    alcoholic: expect.any(Boolean),
                    abv: expect.any(Number)
                }
            );
            
            expect(response.statusCode).toBe(200);
            done();
        });
});