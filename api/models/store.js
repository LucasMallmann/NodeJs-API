const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create geoLocation Schema
const geoSchema = mongoose.Schema({
	type: {
		type: String, // type of data
		default: "Point"
	},
	coordinates: {
		// Array of Numbers
		type: [Number],
		index: "2dsphere"
	}
});


const storeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { 
		type: String, 
		required: [true, 'name is required'] 
	},
	open: {
		type: Boolean, 
		default: true
	},
	slogan: { 
		type:String 
	},
	rank:{
		type: String
	},

	// add geoJson
	// Put a GeoJson Schema here
	geometry: geoSchema

});

module.exports = mongoose.model('Store', storeSchema);
// module.exports = mongoose.model('Geo', geoSchema);