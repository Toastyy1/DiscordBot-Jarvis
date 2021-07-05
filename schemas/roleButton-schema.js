const mongoose = require('mongoose');

const { reqString } = require('./templateReqTypes');

const roleButtonSchema = mongoose.Schema({
  // _id reflects the id of the message
  _id: reqString,
  buttonRole: [{
    _id: false,
    button: reqString,
    role: reqString,
  }],
});

module.exports = mongoose.model('roleButtonSchema', roleButtonSchema);