const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const uuid = uuidv4();

/*NOTE: this script was used to hash the
admin user password. Don't run it again unless
you're trying to change the password.*/

//this needs to be uncommented to run.
mongoose.connect('mongodb://localhost/aerdb', {useNewUrlParser: true})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

var User = mongoose.model('User', new mongoose.Schema({
	unique_id: String,
	username: String,
	password: String,
}));

User.findOne({'username': 'admin'}, function(err, user) {
	if (err) { // probably database error
		console.log('Error finding user.');
		db.close(function() {
			console.log('Mongoose disconnect.');
			process.exit(0);
		})
	} else if (!user) { //didn't find user
		console.log('No user found.');
		db.close(()=>{
			console.log('Mongoose disconnect.');
			process.exit(0);
		})
	} else { //success!
		//hash admin password
		const saltRounds = 10;
		const userPassword = "password";
		bcrypt.hash(userPassword, saltRounds, (err,hash)=>{
			//store hash in aerdb.users
			user.password = hash;
			// log for debuggin. remove this later.
			console.log(user.password);
			// commit to aerdb the changes we made to the users collection.
			user.save((err)=>{
				if (err) {
					console.log(err);
				}else{
					db.close(); /* note db.close() must be inside the
									callback for .save(), since .save()
									is asynchronous. otherwise we might close
									the db while the save process is still running*/
				}
			});
		} )
	}		
});



