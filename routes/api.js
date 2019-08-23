const express = require('express');
const router = express.Router();

const cors = require('cors');

const db = require('../vbsdb.js');

router.use(cors());

router.post('/', [], function (req, res, next) {
    console.log('\n\nPOST request initiated from  ' + req.ip + '\n');
    console.log('POST: ' + objValues2Array(req.body));
    let result;
    result = insertRecord(objValues2Array(req.body));
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
    const records = req.body;
    const fails = [];
    for (const i in records) {
        let result = insertRecord(objValues2Array(records[i]));
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

function insertRecord(values) {
    return db.addRecord(values)
}

function objValues2Array(record) {
    const values = [];
    for (const i in record) {
        if (typeof record[i] === 'string') {
            values.push('"' + record[i] + '"');
        }
        if (typeof record[i] === 'boolean') {
            values.push(record[i] === true ? 1 : 0);
        }
        if (typeof record[i] === 'number') {
            values.push(record[i]);
        }
    }
    return values;
}

module.exports = router;
