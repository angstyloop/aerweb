var express = require('express');
var Memo = require('../models/memo');
var router = express.Router();
var User = require('../models/user');
var uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt');
var filterPrivateContent = require('./filterPrivateContent');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/content/:id', (req, res) => {
// 	res.send('Content '+req.params.id);
// });

//don't need this
// router.get('/content/2', function(req, res, next) {
// 	Memo.findOne().sort({date: -1}).exec((err,recentMemo)=>{
// 		if (err) {next(err);}
// 		if (!recentMemo) {console.log('No memos found.');}
// 		//success
// 		res.send(recentMemo?recentMemo.body:"");
// 	})
// });

router.get('/content/1', (req,res)=>{
	//res.send('hi');
	Memo.findOne().sort({date: -1}).exec((err, recentMemo)=>{
		if (err) {next(err);}
 		//success
		res.render('content/1', {memo: recentMemo?recentMemo:''});
	});
});

router.get('/content/2', (req,res)=>{
	//res.send('hey there');
	Memo.find({}).sort({date: -1}).exec(  function(err, memos) {
		console.log(memos);
		res.render('content/2', {memos: memos});
	})
});

router.get('/content/3-1', (req,res)=>{
	res.render('content/3-1')
});

router.get('/content/3-2', (req,res)=>{
	res.render('content/3-2')
});

router.get('/content/3-3', (req,res)=>{
	res.render('content/3-3')
});

router.get('/content/1/private', filterPrivateContent, function(req,res) {
	res.render('memoCreateForm');
});
router.get('/content/2/private', filterPrivateContent, function(req,res) {
	// res.send(`
	// 	<script type="text/javascript">
	// 	  $(document).ready(function() {
	// 	  	$('#private-form').submit(function(event) {
	// 	  	  event.preventDefault();
	// 	  	  $.ajax({
	// 	  	  	type: 'POST',
	// 	  	  	url: '/memo/create',
	// 	  	  	data: $(this).serialize(),
	// 	  	  	dataType: 'json',
	// 	  	  	success: function(res) {
	// 	  	  	  $('.ajax-content').load(window.clickedLink);
	// 	  	  	  $('#private-form')[0].reset();
	// 	  	  	}
	// 	  	  });
	// 	  	});
	// 	  });
	// 	</script>
	// 	<div class="form-group">
	// 	  <form id="private-form" method="post">
	// 	    <input type="textarea" id="input-text" name="input-text" class="form-control">
	// 	    <input id='post-button' type="submit" value="Post" class="btn btn-info">
	// 	  </form>
	// 	</div>
	// 	`);
	res.render('memoCreateForm');
});

router.get('/content/3', (req,res,next)=>{
	res.send('');
} );

// router.get('/content/3/private', (req,res,next)=>{
// 	res.send('');
// })

router.get('/content/3*', (req,res,next)=>{
	res.send('');
});

router.get('/login', function (req, res, next) {
	console.log("GET /login was called");
	res.send("not implemented");
});

router.post('/login', function (req, res, next) {
	console.log("POST /login was called");
	User.findOne({'username':req.body.username},function(err,user){
		if(user){
			console.log("Found user: " + user.username);
			bcrypt.hash(req.body.password, user.password, (err,match) =>{
				if (match) {
					console.log("Passwords match.");
					req.session.unique_id = user.unique_id = uuidv4();
					user.save(err => console.log(err));
					console.log("Unique user id assigned: "+user.unique_id);
					res.send({'success':true});
				} else {
					console.log("Login Failure.");
					res.send({'success':false});
				}
			});
			// if(user.password==req.body.password){ // length-dependent string comparison vulnerable to timing attacks

			// 	// login success. set the user unique_id to the session id. this may not work.
			// 	console.log("Passwords match.");
			// 	// assign a globally unique identifier string of length 16 to the unique id's of the session and the user
			// 	req.session.unique_id = user.unique_id = uuidv4();
			// 	// save the change we just made to the user collection to the aer database
			// 	user.save(err => console.log(err));
			// 	//print a helpful message to stdout. this is maybe not secure.
			// 	console.log("Unique user id assigned: "+user.unique_id);
			// 	//return an object with a success attribute set to true. jquery on client side uses this.
			// 	res.send({'success':true});
				
			// }else{
			// 	console.log("Login failure.");
			// 	//return an object with a success attribute set to false
			// 	res.send({'success': false});
			// }
		}else{
			console.log("Invalid username.");
			// return an object with a success attribute set to false
			res.send({'success':false});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log('logout');
	req.session.destroy(err => {
		if (err) {
			res.send({'success':false});
			next(err);
		}else{
			res.send({'success':true});
		}
	});
});

// this was for testing
// router.post('/create', function(req,res) {
// 	res.send({'input-text': req.body['input-text']});
// })


module.exports = router;
