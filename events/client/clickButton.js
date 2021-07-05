const mongo = require('../../util/mongo');
const roleButtonSchema = require('../../schemas/roleButton-schema');
const cache = {};

module.exports = async (client, Discord, button) => {  
  await button.reply.defer();
  console.log(button.id);
}