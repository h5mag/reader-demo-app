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
class DbQuery {
	async openDatabase() {
		if (!db) {
			SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION }, successCB, errorCB).then((DB) => {
				db = DB;
			});
		}
	}

	closeDatabase() {
		if (db) {
			console.log('Closing database ...');
			db.close().then((status) => {
				console.log('Database CLOSED');
			}).catch((error) => {
				this.errorCB(error);
			});
		} else {
			console.log('Database was not OPENED');
		}
	}

	async findAllProjectsInDb() {
		await this.openDatabase();

		let projects = [];

		return db.transaction(async (tx) => {
			await tx.executeSql('SELECT * FROM Projects', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					projects.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			return projects;
		});
	}

	async findAllEditionsInDb() {
		await this.openDatabase();

		let editions = [];

		return db.transaction(async (tx) => {
			await tx.executeSql('SELECT * FROM Editions', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			return editions;
		});
	}

	async findOneEditionInDb(edition) {
		await this.openDatabase();

		let ed = null;

		return db.transaction(async (tx) => {
			await tx.executeSql('SELECT * FROM Editions WHERE href = ? LIMIT 1', [edition.href]).then(([tx, results]) => {
				ed = results.rows.item(0);
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			return ed;
		});
	}

	async findAllFavoriteEditionsInDb() {
		await this.openDatabase();

		let editions = [];

		return db.transaction(async (tx) => {
			await tx.executeSql('SELECT * FROM Editions WHERE favorite = 1', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			return editions;
		});
	}

	async findAllDownloadedEditionsInDb() {
		await this.openDatabase();

		let editions = [];

		return db.transaction(async (tx) => {
			await tx.executeSql('SELECT * FROM Editions WHERE downloaded = 1', []).then(([tx, results]) => {
				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					editions.push(results.rows.item(i));
				}
			}).catch((error) => {
				console.log(error);
			});
		}).then(() => {
			return editions;
		});
	}

	async insertEditionFavoriteInDb(edition, projectDomain, favorite) {
		await this.openDatabase();

		db.transaction((tx) => {
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, favorite, edition.downloaded, edition.status]
			);
		}).then(() => { });

		return { ...edition, favorite: favorite };
	}

	async insertEditionDownloadInDb(edition, projectDomain, status = 'downloaded') {
		await this.openDatabase();

		db.transaction((tx) => {
			tx.executeSql('INSERT OR REPLACE INTO Editions (projectDomain, custom_image_src, description, href, path, published, screenshot_src, tags, title, favorite, downloaded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[projectDomain, edition.custom_image_src, edition.description, edition.href, edition.path, edition.published, edition.screenshot_src, toString(edition.tags), edition.title, edition.favorite, status === 'downloaded', status]
			);
		}).then(() => { });

		return { ...edition, downloaded: status === 'downloaded', status: status };
	}

	async insertProjectsInDb(projects) {
		await this.openDatabase();

		db.transaction((tx) => {
			projects.forEach(project => {
				tx.executeSql('INSERT OR REPLACE INTO Projects (domain, name, latest_edition, favorite) VALUES (?, ?, ?, ?)',
					[project.domain, project.name, JSON.stringify(project.latest_edition), !project.favorite]
				);
			});
		}).then(() => { });
	}
}

let Db = (() => {
	let api = new DbQuery();
	return api;
})();

export default Db;
