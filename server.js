//call packages we need
var express = require('express'); //call express
var app = express(); //define our app using express
var bodyParser = require('body-parser');
//BASE SETUP

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin1234@ds039281.mlab.com:39281/ivibear', { useNewUrlParser: true });
var Bear = require('./models/bear');
//Configure app to use bodyParser()
//this will let us get data from the post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //SET THE PORT

//routes for our API
var router = express.Router(); //get an instance of the express Router

//middleware to use for all request
router.use(function(req, res, next) {
	//do logging
	console.log('Something is happening');
	next(); //it make sures we go to the next routes
});

router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

//on routes that end in /bears
router
	.route('/bears')
	.post(function(req, res) {
		//creating a bear
		var bear = new Bear(); //creating a new instance of the Bear model
		bear.name = req.body.name; //set the bears name (comes from request)
		bear.save(function(err) {
			//save the bear and check for errors
			if (err) res.send(err);

			res.json({ message: 'Bear created!' });
		});
	})
	//get all the bears
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) res.send(err);

			res.json(bears);
		});
	});

//on routes that end in /bears/:bear_id
router
	.route('/bears/:bear_id') //get the bear with that id
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) res.send(err);

			res.json(bear);
		});
	})
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) res.send(err);

			bear.name = req.body.name; //update the bears info
			bear.save(function(err) {
				if (err) res.send(err);

				res.json({ message: 'Bear updated!' });
			});
		});
	})
	.delete(function(req, res) {
		Bear.remove(
			{
				_id: req.params.bear_id
			},
			function(err, bear) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			}
		);
	});

//Register our routes
//all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER

app.listen(port);
console.log('Magic happens on port ' + port);
