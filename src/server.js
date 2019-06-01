const express = require('express');
const bodyParser = require('body-parser');

(async ()=> {

	const app = express();
	app.use(bodyParser.json()); //Needed for Post requests
	app.use(bodyParser.urlencoded({ extended: true })); //Needed for Post requests
	const port = process.env.PORT || 42420;

	app.get('/', (req, res) => {
		res.send('welcome to my API!');
	});

	app.listen(port, () => {
		console.log(`Listening on http://localhost:${port}`);
    });

})().catch((error) => {
	console.log(error);
});