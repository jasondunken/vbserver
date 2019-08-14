const express = require('express');
const router = express.Router();

const cors = require('cors');

const db = require('../vbsdb.js');

router.use(cors());

router.post('/', [], function (req, res) {
    console.log('\n\nPOST request initiated................\n');
    if (db.addRecords(req.body)) {
        res.status(200).json({
            vbserver: 'record added',
            eMail: req.body.eMail
        });
    } else {
        res.status(400).json({
            vbserver: 'failed to add record',
            eMail: req.body.eMail
        });
    }
});

router.get('/', async function (req, res) {
    console.log('\n\nGET request initiated................\n');
    const result = await db.search(req.query);
    res.json(result);
});
module.exports = router;
