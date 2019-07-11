// middleware function for use in conjunction with content route get and post methods.

var User = require('../models/user');
var express = require('express');

function filterPrivateContent(req, res, next) {
	// get admin user info
	User.findOne({'username':'admin'}, function(err, adminUser) {
		if(adminUser){
			console.log("user id: " + adminUser.unique_id);
			if(req.session.unique_id==adminUser.unique_id){
				console.log("session id matches admin user id!");
				next();
			}else{
				console.log("session id does not match admin user id!");
				// send empty content
				res.send('');
				//next(err)
			}
		}else{
			console.log('There is no admin user! That seems wrong.');
			next(err);
		}
	});
}

module.exports=filterPrivateContent;