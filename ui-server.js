const express = require('express');

const app = express();

const configJSON = JSON.stringify({apiURL:process.env.API_URL});

app.get('/config.js', function (req, res) {
	res.send(`soaDemoConfig = ${configJSON};`);
});

app.use(express.static('dist'));

app.listen(process.env.PORT);
