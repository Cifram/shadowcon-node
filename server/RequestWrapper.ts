import Express = require('express')
import HttpError = require('./HttpError')

export = function(fn: (req: Express.Request, res: Express.Response) => Promise<any>) {
	return function(req: Express.Request, res: Express.Response) {
		fn(req, res).catch(err => {
			if (err instanceof HttpError) {
				res.status(err.status).send(err.message)
			}
		})
	}
}
