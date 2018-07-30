require("dotenv").config();
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var Twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var input = process.argv;
var liriCommand = input[2];

var movieName = "";
var songName = "";

if (liriCommand === "movie-this") {
	MovieInfo();
}
else if (liriCommand === "my-tweets") {
	logData("liri command: my-tweets");
	LatestTweets();
}
else if (liriCommand === "spotify-this-song") {
	SongInfo(songName);
}
else if (liriCommand === "do-what-it-says") {
	logData("liri command: do-what-it-says");
	doWhatItSays();
}
else {
	console.log("error");
}

function MovieInfo() {for (var i = 3; i < input.length; i++) {
    if (i > 2 && i < input.length) {
      movieName = movieName + " " + input[i];
    }
    if (!movieName) {
        console.log("mr. nobody")
   };

    request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var movieInfo = JSON.parse(body);
        var tomatoRating = movieInfo.Ratings[1].Value;
        var movieResult = JSON.parse(body);

	    logOutput("Movie Title: " + movie.Title);
	    logOutput("Release Year: " + movie.Year);
	    logOutput("IMDB Rating: " + movie.imdbRating);
	    logOutput("Country Produced In: " + movie.Country);
	    logOutput("Language: " + movie.Language);
	    logOutput("Plot: " + movie.Plot);
        logOutput("Actors: " + movie.Actors);
	    logOutput("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
	    logOutput("Rotten Tomatoes URL: " + movie.tomatoURL);
	  }
	});

            console.log(movieResult);
            logData(movieResult);
}

function LatestTweets(){
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	var params = {screen_name: 'jimmy74661614', limit: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log("last 20 tweets");
	    logData("last 20 tweets");
	    for (var i=0; i < tweets.length; i ++) {
	    	var myTweetResults = 
	    		"==========================================================================" + "\r\n" +
	    		"Tweet #" + (i+1) + "\r\n" +
	    		"Tweet: " + tweets[i].text + "\r\n" +
	    		"Created at: " + tweets[i].created_at + "\r\n" +
	    		"==========================================================================" 
	    	console.log(myTweetResults);
	    	logData(myTweetResults);
	    }}
	});
}

function SongInfo(songName) {
	for (var i=3; i < input.length; i++){
		songName = songName + " " + input[i];
	}
	var spotify = new Spotify({
  		id: process.env.SPOTIFY_ID,
  		secret: process.env.SPOTIFY_SECRET
    });
	if (!songName) {
		songName = "The Sign";
	}
	spotify.search({ type: 'track', query: songName, limit: 10 }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
	if (songName === "The Sign") {
		var defaultSong = 
		"Artist: " + data.tracks.items[5].artists[0].name + "\r\n" + 
		"Song title: " + data.tracks.items[5].name + "\r\n" +
		"Preview song: " + data.tracks.items[5].preview_url + "\r\n" +
		"Album: " + data.tracks.items[5].album.name + "\r\n" 
		console.log (defaultSong);
		console.log(addedToLogFile);
		logData(defaultSong);
	}
	else {
		console.log("Top 10 songs on Spotify with the name, " + songName);
		logData("Top 10 songs on Spotify with the name, " + songName);
		for (var i = 0; i < data.tracks.items.length; i++) {
			var trackInfo = data.tracks.items[i];
			var previewSong = trackInfo.preview_url;
			if (previewSong === null) {
				previewSong = "Song preview is not available.";
			}
			var songResults = 
				"==========================================================================" + "\r\n" +
				"Song #" + (i+1) + "\r\n" +
				"Artist: " + trackInfo.artists[0].name + "\r\n" +
				"Song title: " + trackInfo.name + "\r\n" +
				"Preview song: " + previewSong + "\r\n" +
				"Album: " + trackInfo.album.name + "\r\n" +
				"==========================================================================";
			console.log(songResults);
			logData(songResults);
		}}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
  		if (error) {
    		return console.log(error);
  		}
  		var songdataArray = data.split(",");
  		SongInfo(songdataArray[1]);
 	})};
};