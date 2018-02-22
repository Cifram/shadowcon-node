import Database = require('./Database')
import { createConnection, Connection } from "mysql";
import { resolve } from 'path';

export = class MysqlDatabase implements Database {
	private connection: Connection
	
	constructor() {
		this.connection = createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'shadowcon',
		})
	}

	escape(data: string): string {
		return this.connection.escape(data)
	}

	query<Table>(query: string): Promise<Table[]> {
		return new Promise((resolve, reject) => {
			this.connection.query(query, (err, results) => {
				if (err) {
					reject(err)
				} else {
					resolve(results)
				}
			})
		})
	}

	disconnect(): Promise<null> {
		return new Promise((result, reject) => {
			this.connection.end(err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}
}
