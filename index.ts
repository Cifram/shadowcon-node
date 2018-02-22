import Express = require('express')
import Router = require('./server/Router')
import MysqlDatabase = require('./server/MysqlDatabase')

let db = new MysqlDatabase()

let app = Express()

app.use((req, res, next) => {
	console.log(req.method + " " + req.url + " - " + req.header("User-Agent"))
	next()
})

Router(db, app)

app.get("/", (req, res) => {
	res.send("Hello World 2!")
});

app.listen(3000, () => console.log("Express server listening on port 3000"))
