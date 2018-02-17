import express = require('express');

var app = express();

app.use((req, res, next) => {
	console.log(req.method + " " + req.url + " - " + req.header("User-Agent"));
	next();
})

app.get("/", (req, res) => {
	res.send("Hello World 2!");
});

app.listen(3000, () => console.log("Express server listening on port 3000"));
