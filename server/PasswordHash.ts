import scrypt = require('scrypt')

let params = { N: 14, r: 8, p: 1 }

export = {
	hash: async function(password: string) {
		return (await scrypt.kdf(password, params)).toString("hex")
	},

	verify: async function(password: string) {
		return await scrypt.kdfVerify(password, params)
	},
}
