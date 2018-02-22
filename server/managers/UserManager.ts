import UserModel = require('../../common/models/UserModel')
import Database = require('../Database')
import HttpError = require('../HttpError')

export = class UserManager {
	static async get(db: Database, id: number) {
		let results = await db.query<{email: string, name: string, staff: boolean}>("SELECT email, name, staff FROM users WHERE id=" + db.escape(""+id))
		if (results.length == 0) {
			throw new HttpError(404, "User not found")
		}
		return new UserModel({
			id: id,
			email: results[0].email,
			name: results[0].name,
			staff: results[0].staff
		})
	}
}
