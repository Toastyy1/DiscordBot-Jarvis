const mongoose = require('mongoose');

const { reqString } = require('./templateReqTypes');

const prefixSchema = mongoose.Schema({
    _id: reqString,
    prefix: reqString,
});

module.exports = mongoose.model('prefixSchema', prefixSchema);