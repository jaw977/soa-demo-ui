var express = require('express');

var app = express();

const configJSON = JSON.stringify({apiURL:process.env.API_URL});

app.get('/config.js', function (req, res) {
	res.send(`soaDemoConfig = ${configJSON};`);
});

app.use(express.static('htdocs'));

app.listen(process.env.PORT);
