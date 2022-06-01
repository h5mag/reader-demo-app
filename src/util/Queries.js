import SQLite from 'react-native-sqlite-storage';
import { DB_NAME, DB_LOCATION } from '../../config';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const successCB = () => {
	console.log('SQL executed fine');
};

const errorCB = (err) => {
	console.log('error: ', err);
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

export const findAllProjectsInDb = async () => {
	return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		let projects = [];

		return DB.transaction(async (tx) => {
			db = DB;
			await tx.executeSql('SELECT * FROM Projects', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					projects.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			closeDatabase();
			return projects;
		});
	});
};

export const findAllEditionsInDb = async () => {
	return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		let editions = [];

		return DB.transaction(async (tx) => {
			db = DB;
			await tx.executeSql('SELECT * FROM Editions', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			closeDatabase();
			return editions;
		});
	});
};

export const findAllFavoriteEditionsInDb = async () => {
	return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		let editions = [];

		return DB.transaction(async (tx) => {
			db = DB;
			await tx.executeSql('SELECT * FROM Editions WHERE favorite = 1', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			closeDatabase();
			return editions;
		});
	});
};

export const findAllDownloadedEditionsInDb = async () => {
	return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		let editions = [];

		return DB.transaction(async (tx) => {
			db = DB;
			await tx.executeSql('SELECT * FROM Editions WHERE downloaded = 1', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			closeDatabase();
			return editions;
		});
	});
};

export const insertEditionFavoriteInDb = async (edition, projectDomain) => {
	edition.favorite = true;

	SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		DB.transaction((tx) => {
			db = DB;
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, edition.favorite, edition.downloaded]
			);
		}).then(() => {
			closeDatabase();
		});
	});
};

export const removeEditionFavoriteFromDb = async (edition, projectDomain) => {
	edition.favorite = false;

	SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		DB.transaction((tx) => {
			db = DB;
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, edition.favorite, edition.downloaded]
			);
		}).then(() => {
			closeDatabase();
		});
	});
};

export const insertEditionDownloadInDb = async (edition, projectDomain) => {
	edition.downloaded = true;

	SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		DB.transaction((tx) => {
			db = DB;
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, edition.favorite, edition.downloaded]
			);
		}).then(() => {
			closeDatabase();
		});
	});
};

export const removeEditionDownloadFromDb = async (edition, projectDomain) => {
	edition.downloaded = false;

	SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		DB.transaction((tx) => {
			db = DB;
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, edition.favorite, edition.downloaded]
			);
		}).then(() => {
			closeDatabase();
		});
	});
};

export const insertProjectsInDb = async (projects) => {
	SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
		DB.transaction((tx) => {
			db = DB;
			projects.forEach(project => {
				tx.executeSql('INSERT OR REPLACE INTO Projects (domain, name, latest_edition, favorite) VALUES (?, ?, ?, ?)',
					[project.domain, project.name, JSON.stringify(project.latest_edition), !project.favorite]
				);
			});
		}).then(() => {
			closeDatabase();
		});
	});
};
