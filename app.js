var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose")
    Campground    = require("./models/campground");
    seedDB        = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser : true });

app.use(bodyParser.urlencoded(
    {
        extended: true
    }
));

app.set("view engine", "ejs");

// SCHEMA SETUP

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://farm5.staticflickr.com/4044/4175370953_5488caf554.jpg",
//         description: "This is the huge granite hill, no bathrooms. No water. Beautiful granite!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("NEWLY CREATE CAMPGROUND: ");
//             console.log(campground);
//         }
//     });


app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
           res.render("index", {campgrounds:allCampgrounds});
        }
    });    
});

app.post("/campgrounds", function(req, res){
    // get data from the form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            //redirect back to campground
            res.redirect("/campgrounds");
        }

    });
});

app.get("/campgrounds/new", function(req, res)
{
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    //find the campgrounds with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
             console.log(foundCampground);
             //render show template with that campground
             res.render("show", {campground: foundCampground});
        }
    });
   
});

app.listen(8000, function(){
    console.log("YELPCAMP SERVER HAS STARTED!!!");
});