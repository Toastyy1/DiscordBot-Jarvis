const mongoose = require('mongoose');

const { reqString } = require('./templateReqTypes');

const messageReactionSchema = mongoose.Schema({
	// _id reflects the id of the message
	_id: reqString,
	reactionRole: [{
		_id: false,
		reaction: reqString,
		role: reqString,
	}],
});

module.exports = mongoose.model('messageReactionSchema', messageReactionSchema);