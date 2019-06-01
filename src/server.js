const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

(async ()=> {

	const app = express();
	app.use(bodyParser.json()); //Needed for Post requests
    app.use(bodyParser.urlencoded({ extended: true })); //Needed for Post requests
    app.use((request, response, next) => { //Needed for cross origin
        response.header("Access-Control-Allow-Origin", "*"); 
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const spotify = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });

	app.get('/', (req, res) => {
		res.send('welcome to my API!');
	});

    app.post('/', (request, response) => {
        const code = request.query.code;
        if (!code) {
            return response.status(403).send('Require code query parameter');
        }
        return spotify.authorizationCodeGrant(code)
            .then((data) => {
                response.json(data.body);
                console.debug('success', request, response);
                return response;
            })
            .catch((error) => {
                response.status(500).send(error);
                console.error('error', error, request, response);
                return response;
            });
    });

	const port = process.env.PORT || 42420;
	app.listen(port, () => {
		console.log(`Listening on http://localhost:${port}`);
    });

})().catch((error) => {
	console.log(error);
});