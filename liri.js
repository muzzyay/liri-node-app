require("dotenv").config();
const fs = require("fs");
const Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const axios = require("axios");


var request = process.argv[2];
var name = process.argv.slice(3).join(" ");
var text = '';

function song() {

    if (name.trim().length === 0) {
        spotify
            .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
            .then(function (data) {

                text = "\nArtists: " + data.artists[0].name + "\nSong Name: " + data.name + "\nSong's Link: " + data.preview_url + "\nAlbum: " + data.album.name + "\n-----------------------------";
                console.log(text);
                datalog(text);

            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    } else {
        spotify
            .search({ type: 'track', query: name, limit: 1 })
            .then(function (response) {
                
                text = "\nArtists: " + response.tracks.items[0].album.artists[0].name + "\nSong Name: " + response.tracks.items[0].name + "\nSong's Link: " + response.tracks.items[0].preview_url + "\nAlbum: " + response.tracks.items[0].album.name + "\n-----------------------------";
                console.log(text);
                datalog(text);
            })
            .catch(function (err) {
                console.log(err);
            });
    }


}


function concert() {

    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp").then(function (response) {

        response.data.forEach(function (event) {

            text = "\nVenue Name: " + event.venue.name + "\nVenue Location: " + event.venue.city + ", " + event.venue.country + "\nConcert Date: " + moment(Array.from(event.datetime).splice(0, 10).join(""), "YYYY-MM-DD").format("MM/DD/YYYY") + "\n-----------------------------";
            console.log(text);
            datalog(text);
        })
    })
        .catch(function (err) {
            console.log(err);
        });

}

function movie() {
    if (name.trim().length === 0) {
        var queryURL = "http://www.omdbapi.com/?i=tt0485947&y=&plot=short&apikey=trilogy";
    } else {
        queryURL = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";
    }
    axios.get(queryURL).then(
        function (response) {
            text = "\nTitle: " + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMDB Rating: " + response.data.Ratings[0].Value + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n-----------------------------";
            console.log(text);
            datalog(text);
        });

}

function random() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        request = dataArr[0];
        name = dataArr[1];

        switch (request) {
            case "concert-this":
                concert();
                break;
            case "spotify-this-song":
                song();

                break;
            case "movie-this":
                movie();
        }

    });

}

function datalog(data) {
    fs.appendFile("log.txt", data, function (err) {

        if (err) {
            console.log(err);
        }

    });

}




switch (request) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        song();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        random();
}