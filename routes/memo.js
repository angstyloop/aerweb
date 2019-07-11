var express = require('express');
var router = express.Router();
var Memo = require('../models/memo');

/* get most recent memo from database. client side loads content dynamically with jquery */
router.get('/recent', function(req, res, next) {
	Memo.findOne().sort({date: -1}).exec((err,recentMemo)=>{
		if (err) {next(err);}
		if (!recentMemo) {console.log('No memos found.');}
		//success
		res.send(recentMemo?recentMemo.body:"");
	})
});

router.post('/create', (req,res,next)=>{
	// put the user input into a new memo
	var newMemo = new Memo({
		body: req.body? req.body['input-text']: ""
		//date is set to Date.now() by default in Memo model
	});

  // save the memo to the database
  newMemo.save((err) => {
  	if(err){
  		console.log("Error encountered when saving memo to database.")
  		next(err);
  	}else{
  		console.log("Memo saved to database successfully!");
  		res.send({'success':true});
  	}
  });
});

module.exports = router;
