//instructions to run this file.
// make .env file and add three variables
//CLIENT_ID, CLIENT_SECRET, PORT

const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  accessToken: ''
});

app.post('/', function(req, res) {
  if (!req || !req.query) return res.status(500);
  const q = req.body.q;
  if (q.trim().length === 0) return res.json([]);

  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);

      spotifyApi
        .searchTracks(`track:${encodeURIComponent(q)}`, {
          limit: 20,
          fields: 'items'
        })
        .then(
          function(data) {
            // res.send(data.body.tracks.items[0].name);
            res.send(data.body);
          },
          function(err) {
            console.log('Something went wrong!', err);
          }
        );
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
});

app.listen(process.env.PORT);
