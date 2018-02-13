const router = require('express').Router(),
	jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
	user = new User();
	user.email = req.body.email;
	user.name = req.body.name;
	user.password = req.body.password;
	user.picture = user.gravatar();
	user.isSeller = req.body.isSeller;

	User.findOne({ email: req.body.email }, (err, existingUser) => {
		if (existingUser) {
			res.json({
				success: false,
				message: 'Account with that email already exists'
			});
		} else {
			user.save();
			let token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '7d' });
			res.json({
				success: true,
				message: 'Enjoy your stay',
				token
			});
		}
	});
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'User not found'
			});
		} else {
			let validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					sucess: false,
					message: 'Wrong password'
				});
			} else {
				let token = jwt.sign({ user }, process.env.SECRET, {
					expiresIn: '7d'
				});
				res.json({
					success: true,
					message: 'Enjoy your stay',
					token
				});
			}
		}
	});
});

module.exports = router;
