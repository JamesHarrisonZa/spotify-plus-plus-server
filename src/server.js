const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

require('dotenv').config(); //ToDo: This is only needed for local. 
const spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.get('/login', function (req, res) {

    const scopes = ['user-library-read', 'user-modify-playback-state', 'user-read-private', 'user-read-email'];
    const state = {};
    const authorizeURL = spotify.createAuthorizeURL(scopes, state);
    res.redirect(authorizeURL);
});

app.get('/callback', function (req, res) {
    const code = req.query.code || null
    //console.log(`Got code from spotify: ${code}`);
    spotify.authorizationCodeGrant(code)
        .then((data) => {
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];

            // console.log(`The access token is: ${accessToken}`);
            // console.log(`The refresh token is: ${refreshToken} `);
            // console.log(`The token expires in: ${data.body['expires_in']}`);

            const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
            res.redirect(`${uri}?access_token=${accessToken}&refresh_token=${refreshToken}`);
        })
        .catch((err) => {
            console.log('Something went wrong!', err);
        });
});

const port = process.env.PORT || 42420;
console.log(`Listening on port http://localhost:${port}`);
console.log(`Go to http://localhost:${port}/login to initiate authentication flow.`);
app.listen(port);