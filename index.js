require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');



const app = express();
const port = process.env.APP_PORT || 3000; // Use the PORT variable from .env or default to 3000

app.use(bodyParser.json());
app.use('/users', userRoutes);


app.use('/', (req, res) => {
    res.send({
        message: "app lancar"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
