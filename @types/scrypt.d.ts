declare module 'scrypt' {
	class Param {
		N: number
		r: number
		p: number
	}

	function paramSync(maxTime: number): Param
	function paramSync(maxTime: number, maxMem: number): Param
	function paramSync(maxTime: number, maxMem: number, maxMemFrac: number): Param

	function param(maxTime: number): Promise<Param>
	function param(maxTime: number, maxMem: number): Promise<Param>
	function param(maxTime: number, maxMem: number, maxMemFrac: number): Promise<Param>

	function kdfSync(key: string, param: Param): Buffer
	function kdfSync(key: Buffer, param: Param): Buffer

	function kdf(key: string, param: Param): Promise<Buffer>
	function kdf(key: Buffer, param: Param): Promise<Buffer>

	function verifyKdfSync(kdf: string, key: string): boolean
	function verifyKdfSync(kdf: Buffer, key: string): boolean
	function verifyKdfSync(kdf: Buffer, key: Buffer): boolean
	function verifyKdfSync(kdf: string, key: Buffer): boolean

	function verifyKdf(kdf: string, key: string): Promise<boolean>
	function verifyKdf(kdf: Buffer, key: string): Promise<boolean>
	function verifyKdf(kdf: Buffer, key: Buffer): Promise<boolean>
	function verifyKdf(kdf: string, key: Buffer): Promise<boolean>

	function hashSync(key: string, param: Param, hashLength: number, salt: string): Buffer
	function hashSync(key: Buffer, param: Param, hashLength: number, salt: string): Buffer
	function hashSync(key: Buffer, param: Param, hashLength: number, salt: Buffer): Buffer
	function hashSync(key: string, param: Param, hashLength: number, salt: Buffer): Buffer

	function hash(key: string, param: Param, hashLength: number, salt: string): Promise<Buffer>
	function hash(key: Buffer, param: Param, hashLength: number, salt: string): Promise<Buffer>
	function hash(key: Buffer, param: Param, hashLength: number, salt: Buffer): Promise<Buffer>
	function hash(key: string, param: Param, hashLength: number, salt: Buffer): Promise<Buffer>
}
