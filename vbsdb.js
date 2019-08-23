const sqlite3 = require('sqlite3').verbose();

const record = require('./record.js');

const dbPath = 'vbsurvey.db';
const inMemoryDB = ':memory:';

let db;

function setupDB() {
    const path = process.env.NODE_ENV === 'dev' ? dbPath : inMemoryDB;
    db = new sqlite3.Database(path, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to " + dbPath);
        }
    });
    let stmt = 'CREATE TABLE IF NOT EXISTS vbsurvey(';
    for (let property in record) {
        if (record.hasOwnProperty(property)) {
            const propType = typeof record[property];
            if (propType === 'string') { stmt += property + ' TEXT,'; }
            if (propType === 'number') { stmt += property + ' REAL,'; }
            if (propType === 'boolean') { stmt += property + ' INT,'; }
        }
    }
    stmt += 'dateEntered TEXT, timestamp TEXT);'
    db.run(stmt);
}

function insertRecord(data) {
    // TODO: need to sanitize input before using and verify it's a Record
    let stmt = 'INSERT INTO vbsurvey VALUES (';
    for (let d in data) {
        if (data.hasOwnProperty(d)) {
            const propType = typeof data[d];
            if (propType === 'string' || propType === 'number') { stmt += data[d] + ','; }
            if (propType === 'boolean') { stmt += (data[d] === true ? 1 : 0) + ',' }
        }
    }

    // add a time stamp to the record
    const time = new Date();
    const dateEntered = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
    const timestamp = time.toISOString();
    stmt += '"' + dateEntered + '",';
    stmt += '"' + timestamp + '");';
    console.log(stmt);
    return new Promise((resolve, reject) => {
        db.run(stmt, [], function (err, res) {
            if (err) {
                console.log('insertRecord() error! ' + err.message);
                reject(err);
            } else {
                console.log('insertRecord() res ' + res);
                resolve(res);
            }
        });
    });
}

function selectRecords(query) {
    // queries db and assembles results into a js object, returns to api to be converted to json for transmission
    let stmt = 'SELECT * FROM vbsurvey WHERE ' + query;
    if (query === '') {
        stmt = 'SELECT * FROM vbsurvey;';
    }
    return new Promise((resolve, reject) => {
        let result = { 'records': [] };
        db.all(stmt, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows === undefined) {
                console.log('No results returned!');
            } else {
                rows.forEach((row) => {
                    result.records.push(row);
                });
            }
            resolve(result);
        });
    });
}

function close() {
    db.close();
}

module.exports = {
    initDB() {
        setupDB();
    },
    async addRecords(data) {
        return await insertRecord(data);
    },
    async search(query) {
        let stmt = '';
        for (let v in query) {
            if (query[v] !== '') {
                stmt += v + '=' + query[v] + ' AND ';
            }
        }
        stmt = stmt.substring(0, stmt.length - 5);
        return await selectRecords(stmt);
    },
    closeDB() {
        close();
    }
};
