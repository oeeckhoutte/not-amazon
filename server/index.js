require('dotenv').config();

const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	cors = require('cors');

const userRoutes = require('./routes/account');

const app = express();
mongoose.connect(process.env.DATABASE_URL);
mongoose.set('debug', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.use('/api/accounts/', userRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
