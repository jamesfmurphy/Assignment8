var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/urlList', function(req, res) {
	var db = req.db;
	var collection = db.get('urlCollection');
	collection.find({}, {}, function(e, docs){
		res.render('urlList', {
			"urlList" : docs
		});
	});	
});

router.get('/processURL', function(req, res) {
	res.render('processURL', {title: 'Enter URL'});
});

router.get('/topTen', function(req, res) {
	//res.render('topTen', {title: 'Top Ten Pairs'});

	var db = req.db;
	var collection = db.get('urlCollection');
	collection.find({}, {}, function(e, docs){
		res.render('topTen', {
			"topTen" : docs
		});
    });		
});

router.get('/hitCount', function(req, res) {
	console.log("In the get");
	res.render('hitCount', {title: 'Hit Counter'});
});


router.post('/hitCount', function(req, res) {
	console.log('In the post');
	
	var db = req.db;

	var hitCount = 0;
	var clickedURL = req.body.id;
	consol.log(req);
	console.log('You clicked: ', clickedURL);

	var collection = db.get('urlCollection');

	collection.find({
		"longURL": clickedURL
	});

});

router.post('/processURL', function(req, res) {
    var ourObject = {};
	var db = req.db;

	var append = "";
    var library ="abcdefghijklmnopqrstuvwxyz";

    for(var i = 0; i < 4; i++)
    {
  	  append += library.charAt(Math.floor(Math.random()* library.length));
    }

	var processURL = req.body.processURL;
	var newURL = 'http://' + processURL.split('/')[2] + '/' + append;

	var collection = db.get('urlCollection');

	var query = { $or: [ {longURL: processURL}, {shortURL: processURL}]};

	collection.findOne(query, function (err, result) {
		//console.log(query);
		console.log(result);
		if(result == null) {
			collection.insert({
				"longURL": processURL,
				"shortURL": newURL
			}, function (err, doc) {
				if (err) {
					res.send("Problem");
				}
				else {
					//res.location("urlList");
					//res.redirect("urlList");
					res.location("urlList");
					res.redirect("urlList");
				 }
			});
		} else{
			console.dir(result);
			if(processURL === result.shortURL)
			{
				res.location("urlList");
				res.redirect("urlList");
	             //res.render('processURL', {longURL: result.longURL, shortURL: result.shortURL});
				//return longURL
				console.log(result.longURL);
				console.log(result.shortURL);
			}
			else if (processURL === result.longURL)
			{
				res.location("urlList");
				res.redirect("urlList");
				//res.render('processURL', {longURL: result.longURL, shortURL: result.shortURL});
				//return shortURL
				console.log(result.longURL);
				console.log(result.shortURL);
			}
		}
	});	
});

module.exports = router;
