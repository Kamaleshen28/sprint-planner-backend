require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { PORT, ENV } = require('./utils/config');
const API_ROUTER = require('./routes');
// const validateJWT = require('./middlewares/authMiddleware');
const validateToken = require('./middlewares/authMiddlewareOkta');

const app = express();
// hide powered by express
app.disable('x-powered-by');

const corsOptions = {
  origin: 'http://localhost:3000',
  exposedHeaders: ['filename'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Express server is running');
});
// app.use('/auth', AUTH_ROUTER);
app.use('/api', validateToken, API_ROUTER);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${ENV} mode`);
});
