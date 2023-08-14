const hostname = 'localhost';
const port = 8080;

const express = require('express');
const app = express();

const fs = require("fs");
const path = require("path");

// path to directory containing JSON files
const dir = path.join(__dirname, '/country-objects');

let dataArray;

// serves the css as static so css will be applied
app.use(express.static(__dirname));

// this renders the index.html file
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

// this retrieves a request from the client when the load button is pressed in the html
app.get('/get-countries', function (req,res){
    // debugging client response
    //console.log(`get-countries function called\n`);

    let data = {}; // object to hold merged data

    fs.readdir(dir, function (err, files) {
        if (err) {
            console.log('ERROR: getting directory information: ' + err);
            res.status(500).send('ERROR: getting directory information');
        } else {
            files.forEach(function(file) {
                // check if file is JSON
                if (path.extname(file) === '.json') {
                    let filepath = path.join(dir, file);
                    // read file contents and parse as JSON
                    let fileData = JSON.parse(fs.readFileSync(filepath));
                    fileData.forEach(function(item) {
                        // extract the country key
                        let country = item['country'];
                        // if the country key doesn't exist in data object, create it
                        if (!(country in data)) {
                            data[country] = {};
                        }
                        // merge the item data into the country object
                        Object.assign(data[country], item);
                    });
                }
            });
            // convert the data object into an array
            dataArray = Object.values(data);
            // send the merged data as response
            res.send(dataArray);
        }
    });
});

// this retrieves a request from the client when the load all countries button is pressed
app.get('/get-all-countries', function (req, res){
    res.send(dataArray)
});


// server listens to the client
app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/\n`);
});