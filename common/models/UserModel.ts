export = class User {
	id: number
	email: string
	name: string
	staff: boolean

	constructor(args: {id: number, email: string, name: string, staff: boolean}) {
		this.id = args.id
		this.email = args.email
		this.name = args.name
		this.staff = args.staff
	}
}
