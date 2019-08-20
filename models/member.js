var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Member', new Schema ({
	unique_id: String,
	name: String,
	email: String,
	bio: String
}));
