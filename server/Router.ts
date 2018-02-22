import Express = require('express')
import User = require('./rest/User')
import Database = require('./Database')

export = function(db: Database, app: Express.Application) {
	User(db, app)
}
