const express = require('express');
const router = express.Router();

const cors = require('cors');

const db = require('../vbsdb.js');

router.use(cors());

router.post('/', [], function (req, res, next) {
    console.log('\n\nPOST request initiated from  ' + req.ip + '\n');
    let result;
    result = insertRecord(req.body);
    result.then(success => {
        res.status(200).json({
            vbserver: 'record added',
            eMail: req.body.eMail
        });
    }).catch(err => {
        res.status(400).json({
            vbserver: 'add record failed ' + err
        });
    });
});

router.post('/batch', [], function (req, res, next) {
    console.log('\n\nPOST request initiated from  ' + req.ip + '\n');
    console.log('request: api/batch?' + JSON.stringify(req.body));
    const records = req.body;
    const fails = [];
    for (const i in records) {
        let result = insertRecord(obj2SQL(records[i]));
        result.then(success => {
            console.log('/batch record added');
        }).catch(err => {
            fails.push(err);
        });
    }
    if (fails.length > 0) {
        res.status(400).json({
            vbserver: 'add record failed ' + JSON.stringify(fails)
        });
    } else {
        res.status(200).json({
            vbserver: 'records added'
        });
    }
});

router.get('/', async function (req, res) {
    console.log('\n\nGET request initiated from  ' + req.ip + '\n');
    const result = await db.search(req.query);
    res.json(result);
});

function insertRecord(record) {
    return db.addRecords(record)
}

function obj2SQL(record) {
    for (const i in record) {

    }
}

module.exports = router;
