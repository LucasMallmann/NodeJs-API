const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create geoLocation Schema
const geoSchema = new Schema({
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


const storeSchema = new Schema({
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