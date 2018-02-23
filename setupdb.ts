import Database = require('./server/MysqlDatabase')
import PasswordHash = require("./server/PasswordHash")

let body = async function() {
	let database = await new Database()

	let query = function(query: string) {
		console.log(query)
		return database.query(query)
	}

	let password = async function() {
		return database.escape(await PasswordHash.hash("1234"))
	}

	try {
		await query("DROP DATABASE IF EXISTS shadowcon")
		await query("CREATE DATABASE shadowcon")
		await query("USE shadowcon")
		await query(
			"CREATE TABLE users (" +
				"id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
				"email VARCHAR(255) CHARACTER SET utf8 NOT NULL UNIQUE KEY, " +
				"name VARCHAR(255) NOT NULL, " +
				"password VARCHAR(255) NOT NULL, " +
				"staff BOOL NOT NULL" +
			")"
		)
		await query(
			"INSERT INTO users " +
			"(email, name, password, staff) " +
			"VALUES(\"herufeanor@gmail.com\", \"Michael Powell\", " + await password() + ", TRUE)"
		)
		await query(
			"INSERT INTO users " +
			"(email, name, password, staff) " +
			"VALUES(\"rando@gmail.com\", \"Bob Nobody\", " + await password() + ", FALSE)"
		)

		let returnedPasswords = await query("SELECT password FROM users")

		await database.disconnect()
	} catch (err) {
		console.log("\nError:\n" + err)
	}
	process.exit()
}
body()
