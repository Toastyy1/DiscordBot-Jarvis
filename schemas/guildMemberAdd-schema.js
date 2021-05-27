const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const newMemberSchema = mongoose.Schema({
	_id: reqString,
    memberUpdateChannel: reqString,
    color: reqString,
    message: reqString,
    title: reqString,
});

module.exports = mongoose.model('guildMemberAdd', newMemberSchema);