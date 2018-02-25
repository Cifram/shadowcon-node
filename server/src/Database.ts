interface Database {
	escape(data: string): string
	query<Table>(query: string): Promise<Table[]>
	disconnect(): Promise<null>
}

export = Database
