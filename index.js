require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000; // Use the PORT variable from .env or default to 3000

app.use(bodyParser.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
