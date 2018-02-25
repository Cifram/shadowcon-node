import Express = require('express')
import Router = require('./Router')
import MysqlDatabase = require('./MysqlDatabase')

let db = new MysqlDatabase()

let app = Express()

app.use((req, res, next) => {
	console.log(req.method + " " + req.url + " - " + req.header("User-Agent"))
	next()
})

Router(db, app)

app.get("/", (req, res) => {
	res.sendfile("./assets/index.html")
});

app.get("/**", (req, res) => {
	res.sendfile("./assets/" + req.path)
})

app.listen(3000, () => console.log("Express server listening on port 3000"))
