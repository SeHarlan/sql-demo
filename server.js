const { app } = require('./app.js');

// Start the server
// (use PORT from .env!)
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`running on ${port}`);
});
