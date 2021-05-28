const mongoose = require('mongoose');

const { reqString } = require('./templateReqTypes');

const newMemberSchema = mongoose.Schema({
	_id: reqString,
    memberUpdateChannel: reqString,
    color: reqString,
    message: reqString,
    title: reqString,
});

module.exports = mongoose.model('guildMemberAdd', newMemberSchema);