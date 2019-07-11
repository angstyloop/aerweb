var mongoose = require('mongoose');
module.exports = mongoose.model('Memo', new mongoose.Schema({
	body: String,
	date: {
		type: Date,
		default: Date.now
	}
}));
