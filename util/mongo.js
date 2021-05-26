const mongoose = require('mongoose');
const mongoPath = `mongodb+srv://admin:${process.env.MONGODBPASSWORD}@cluster0.vetul.mongodb.net/${process.env.DATABASENAME}?retryWrites=true&w=majority`;

module.exports = async () => {
	await mongoose.connect(mongoPath, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).catch(err => console.log('An error has occured while connecting to the database:\n' + err));

	return mongoose;
};
