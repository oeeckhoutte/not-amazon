require('dotenv').config();
const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.json({ hello: 'world' }));

app.listen(port, () => console.log(`Server started on port ${port}`));
