require('dotenv').config({ path: '../.env.development' });
const express = require('express');
const cors = require('cors');
const { PORT, ENV } = require('./utils/config');
const API_ROUTER = require('./routes');
// const validateJWT = require('./middlewares/authMiddleware');
const validateToken = require('./middlewares/authMiddlewareOkta');

const app = express();

app.use(cors());
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
