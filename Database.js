import React, { useEffect } from 'react';
import App from './App';
import SQLite from 'react-native-sqlite-storage';
import { DB_NAME, DB_LOCATION } from './config';
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

export default function Database() {
    const successCB = () => {
        console.log('SQL executed fine');
    };

    const errorCB = (err) => {
        console.log('error: ', err);
    };

    useEffect(() => {
        if (!db) {
            SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
                db = DB;
                populateDatabase(DB);
            });
        }
    }, []);

    const populateDatabase = (DB) => {
        DB.transaction(populateDB).then(() => {
            console.log('Database populated ... executing query ...');
            closeDatabase();
            // DB.transaction(queryProjects).then((result) => {
            //     console.log('Transaction is now finished');
            //     console.log('Processing completed');
            // });
        }).catch((error) => {
            console.log('Received error: ', error);
        });
    };

    const populateDB = async (tx) => {
        // console.log('Executing DROP stmts');
        // tx.executeSql('DROP TABLE IF EXISTS Projects;');
        // tx.executeSql('DROP TABLE IF EXISTS Editions;');

        console.log('Executing CREATE stmts');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Projects( '
            + 'domain VARCHAR(20) PRIMARY KEY NOT NULL, '
            + 'name TEXT, '
            + 'latest_edition TEXT, '
            + 'favorite BOOLEAN)').catch((error) => {
                errorCB(error);
            });

        tx.executeSql('CREATE TABLE IF NOT EXISTS Editions( '
            // + 'FOREIGN KEY ( project ) REFERENCES Projects ( id ) '
            + 'projectDomain, '
            + 'custom_image_src TEXT, '
            + 'description TEXT, '
            + 'href TEXT PRIMARY KEY NOT NULL, '
            + 'path TEXT, '
            + 'published DATETIME, '
            + 'screenshot_src TEXT, '
            + 'tags TEXT, '
            + 'title TEXT, '
            + 'favorite BOOLEAN, '
            + 'downloaded BOOLEAN, '
            + 'status TEXT ) ; ').catch((error) => {
                errorCB(error);
            });

        tx.executeSql('UPDATE Editions SET status = "failed" WHERE status = "downloading"', []).catch((error) => {
            errorCB(error);
        });
    };

    const closeDatabase = () => {
        if (db) {
            console.log('Closing database ...');
            db.close().then((status) => {
                console.log('Database CLOSED');
            }).catch((error) => {
                errorCB(error);
            });
        } else {
            console.log('Database was not OPENED');
        }
    };

    return (
        <App />
    );
}
