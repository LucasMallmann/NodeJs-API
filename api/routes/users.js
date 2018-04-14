const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// don't need a logout route
router.post('/signup', (req, res, next) =>{
	// find out if the email passed already existis
	User.find({email: req.body.email})
	.exec()
	.then(user => {
		//if the user already exists...or the email whatever
		if(user){
			res.status(409).json({
				message: 'Email already exists'
			});
		}
		// if the user does not exists
		else{
			// hash the user password
			// it takes 3 params
			// 1 - String to hash.
			// 2 - Number of random characters that are going to be placed in the string 
			// 3 - Callback function to execute whatever I decide 
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				// In case of the hash gone wrong
				if(err){
					res.status(500).json({
						error: err
					});
				}else{
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					});
				}

				user
					.save()
					.then(result => {
						console.log(result);
						res.status(200).json({
							message: 'User created'
						});
					})
					.catch(function(err){
						res.status(500).json({
							error: err
						});
					})

			}); // end bcrypt.hash
		}
	});
	
});


// get all users
router.get('/', (req, res, next) => {
	User.find()
		.exec()
		.then(result => {
			
			let response = {
				count: result.length,

				users: result.map(user => {
					return {
						_id: user._id,
						email: user.email,
						password: user.password
					}
				})
			}

			res.status(200).json(response);

		})
		.catch();
});


// delete
router.delete('/:_userId', (req, res, next) => {
	User.remove({_id: req.params.userId})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'User deleted'
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		})
});

module.exports = router;