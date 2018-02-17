require('dotenv').config();

const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	cors = require('cors');

const userRoutes = require('./routes/account'),
	mainRoutes = require('./routes/main'),
	sellerRoutes = require('./routes/seller');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);

app.get('*', (req, res) => res.json({ hello: 'world' }));
app.listen(port, () => console.log(`Server started on port ${port}`));
