var express = require('express');
var bodyParser = require('body-parser')
var fs = require("fs");
var app = express();
app.use(bodyParser.json());


app.get('/restaurant', function (req, res) {
    fs.readFile( __dirname + "/" + "burgerRestaurantMenu.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})

app.get('/restaurantMenu', function (req, res) {
    fs.readFile( __dirname + "/" + "burgerRestaurantMenu.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        res.end( JSON.stringify(data.RestaurantMenuCategories) );
    });
})

app.get('/submitOrder/:typeId/:burgerId', function (req, res) {
    fs.readFile( __dirname + "/" + "burgerRestaurantMenu.json", 'utf8', function (err, data) {
        var idOfFoodType = parseInt(req.params.typeId);
        var idOfBurgerType = parseInt(req.params.burgerId);
        var output = 'Not Found'
        data = JSON.parse(data);

        for(var i = 0; i<data.RestaurantMenuCategories.length; i++){
            if(data.RestaurantMenuCategories[i].Id === idOfFoodType){
                //okay
                console.log("found:" + idOfFoodType);
                for(var j = 0; j<data.RestaurantMenuCategories[i].Items.length; j++){
                    console.log("searching:" + data.RestaurantMenuCategories[i].Items[j].Id + " in " + idOfBurgerType);

                    if(data.RestaurantMenuCategories[i].Items[j].Id === idOfBurgerType){
                        output = data.RestaurantMenuCategories[i].Items[j];
                        console.log("you ordered: " + data.RestaurantMenuCategories[i].Items[j]);
                    }
                }
            }
        }

        res.end( JSON.stringify(output) );
    });
})


app.post('/albums', function (req, res) {
    // parses the request url


    var newAlbum = req.body;
    fs.readFile( __dirname + "/" + "albums.json", 'utf8', 		function (err, data) {
        data = JSON.parse( data );
        data.push(newAlbum);
        res.end( JSON.stringify(data));
        fs.writeFile(__dirname + "/" + "albums.json",
            JSON.stringify(data), function
                (err) {
                if (err)
                    return console.log(err);
            });
    });

});

app.put('/albums', function (req, res) {
    var updatedAlbum = req.body;
    fs.readFile( __dirname + "/" + "albums.json", 'utf8',
        function (err, data) {
            data = JSON.parse( data );
            for (var i = 0; i<data.length; i++) {
                if (data[i].id == updatedAlbum.id) {
                    data[i] = updatedAlbum;
                }
            }
            res.end( JSON.stringify(data));
            fs.writeFile(__dirname + "/" + "albums.json",
                JSON.stringify(data), function
                    (err) {
                    if (err)
                        return console.log(err);
                });
        });
    res.end( "album updated if it existed" );

});



var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('listening on port: ' + port);
});
