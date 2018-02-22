import Express = require('express')
import Database = require('../Database')
import UserModel = require('../../common/models/UserModel')
import UserManager = require('../managers/UserManager')
import HttpError = require('../HttpError')
import RequestWrapper = require('../RequestWrapper')

export = function(db: Database, app: Express.Application) {
	app.get("/user/:user_id", RequestWrapper(async function(req, res) {
		let id = Number(req.params["user_id"])
		res.send(JSON.stringify(await UserManager.get(db, id)))
	}))
}
