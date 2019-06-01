const express = require('express');
const request = require('request');
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
    console.log(`Got Access token: ${code}`);
    //ToDo: Change to use spotify-web-api-node
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64'))
        },
        json: true
    }
    request.post(authOptions, function (error, response, body) {
        const access_token = body.access_token;
        const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
        res.redirect(uri + '?access_token=' + access_token);
    });
});

console.log(`SPOTIFY_CLIENT_ID: ${process.env.SPOTIFY_CLIENT_ID}`);
console.log(`SPOTIFY_CLIENT_SECRET: ${process.env.SPOTIFY_CLIENT_SECRET}`);
console.log(`SPOTIFY_REDIRECT_URI: ${process.env.SPOTIFY_REDIRECT_URI}`);

const port = process.env.PORT || 42420;
console.log(`Listening on port http://localhost:${port}`);
console.log(`Go to http://localhost:${port}/login to initiate authentication flow.`);
app.listen(port);