require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const kategoriRoute = require('./routes/kategoriRoute');
const kuesionerRoute = require('./routes/kuesionerRoute');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors({
    origin: 'https://be-capstone-project-aethyk4pbq-et.a.run.app'
}));
const port = process.env.PORT || 3000; // Use the PORT variable from .env or default to 3000

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/kategoris', kategoriRoute);
app.use('/kuesioners', kuesionerRoute);


// app.use('/', (req, res) => {
//     res.send({
//         message: "app lancar"
//     })
// })
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
