const express = require('express');
const mongoose = require('mongoose');
const router = express();
const Store = require('../models/store');
// const Geo = require('../models/store/')

router.get('/', (req, res, next) => {
	Store.aggregate().near({
		near: {
			'type': 'Point',
			'coordinates': [parseFloat(req.query.lng), parseFloat(req.query.lat)]
		},
		maxDistance: 100000,
		spherical: true,
		distanceField: "dist.calculated"
	})
		.then(stores => {
			res.status(200).json(stores);
			// res.send(stores);
		})
		.catch(err => {
			error: err
		});
});

router.post('/', function(req, res, next){
	var store = new Store({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			open: req.body.open,
			slogan: req.body.slogan,
			rank: req.body.rank,
			geometry: req.body.geometry
	});

	store.save()
		.then(result => {
			res.status(201).json({
				createdStore: {
					name: res.name,
					open: req.body.open,
					slogan: req.body.slogan,
					rank: req.body.rank,
					geometry: req.body.geometry
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});

});

module.exports = router;