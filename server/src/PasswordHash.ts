import scrypt = require('scrypt')

let params = { N: 14, r: 8, p: 1 }

export = {
	hash: async function(password: string): Promise<string> {
		return (await scrypt.kdf(password, params)).toString("hex")
	},

	verify: async function(password: string, hash: string): Promise<boolean> {
		return await scrypt.verifyKdf(Buffer.from(hash, "hex"), password)
	},
}
