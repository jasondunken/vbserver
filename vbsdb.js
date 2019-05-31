const sqlite3 = require('sqlite3').verbose();

const record = require('./record.js');

const dbURL = 'vbsurvey.db';

let db;

function setupDB() {
    db = new sqlite3.Database(dbURL, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to " + dbURL);
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
    stmt = stmt.substring(0, stmt.length - 1); // remove the last comma before closing the statement
    stmt += ');';
    db.run(stmt);
}

function insertRecord(data) {
    let stmt = 'INSERT INTO vbsurvey VALUES (';
    for (let d in data) {
        if (data.hasOwnProperty(d)) {
            const propType = typeof data[d];
            if (propType === 'string' || propType === 'number') { stmt += data[d] + ','; }
            if (propType === 'boolean') { stmt += (data[d] === true ? 1 : 0) + ',' }
        }
    }
    stmt = stmt.substring(0, stmt.length - 1);
    stmt += ');';
    console.log(stmt);
    db.run(stmt);
}

function selectRecords(query) {
    // queries db and assembles results into a js object, returns to api to be converted to json for transmission
    console.log(query);
    const stmt = 'SELECT * FROM vbsurvey';
    let results = { 'records': [] };

    db.all(stmt, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            results.records.push(row);
        });
        console.log(results);
    });
    return results;
}

function close() {
    db.close();
}

module.exports = {
    initDB: function() {
        setupDB();
    },
    addRecord: function(data) {
        insertRecord(data);
    },
    search(query) {
        return selectRecords(query);
    },
    closeDB() {
        close();
    }
};
