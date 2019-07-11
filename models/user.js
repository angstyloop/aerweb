var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema ({
	unique_id: String,
	//email: String,
	username: String,
	password: String,
	//passwordConf: String
}));
