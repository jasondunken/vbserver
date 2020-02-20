const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
const cors = require('cors');

const apiRouter = require('./routes/api');
const db = require('./vbsdb.js');

if (!process.env.PRODUCTION) {
  dotenv.config();
}

app = express();
app.set('port', process.env.PORT);

app.use(cors());

// default maximum request body size is 100kb
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static_files')));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static_files/index.html'));
});

db.initDB();

app.listen(process.env.PORT, () => {
  console.log('server listening on port: ', process.env.PORT);
});

module.exports = app;
