import assert = require('assert')
import PasswordHash = require('./PasswordHash')
import 'mocha';

describe('PasswordHash', () => {
	it('should verify successfully', async () => {
		let hash = await PasswordHash.hash("test")
		let valid = await PasswordHash.verify("test", hash)
		assert(valid)
	})
})
