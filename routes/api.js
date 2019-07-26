const express = require('express');
const router = express.Router();

const cors = require('cors');

const db = require('../vbsdb.js');

router.use(cors());

router.post('/', function(req, res, next) {
    db.addRecord(req.body);
    res.json({
    vbserver: 'record added',
    eMail: req.body.eMail,
    });
});

router.get('/', async function(req, res) {
    console.log('\n\nGET request initiated................\n');
    const result = await db.search(req.query);
    res.json(result);
});
module.exports = router;
