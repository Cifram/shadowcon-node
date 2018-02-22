import HttpStatus = require('./HttpStatus')

export = class HttpError {
	constructor(public status: HttpStatus, public message: string) {}
}
