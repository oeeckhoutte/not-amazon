const router = require('express').Router(),
	jwt = require('jsonwebtoken');

const User = require('../models/user'),
	auth = require('../middleware/auth');

router.post('/signup', (req, res) => {
	const { email, name, password, isSeller } = req.body;
	user = new User({
		email,
		name,
		password,
		isSeller
	});
	user.picture = user.gravatar();

	User.findOne({ email }, (err, existingUser) => {
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

router.post('/login', (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }, (err, user) => {
		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'User not found'
			});
		} else {
			let validPassword = user.comparePassword(password);
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

router
	.route('/profile')
	.get(auth, (req, res) => {
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			res.json({
				success: true,
				user,
				message: 'Success'
			});
		});
	})
	.post(auth, (req, res, next) => {
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			if (err) return next(err);

			const { email, password, name, isSeller } = req.body;
			if (email) user.email = email;
			if (name) user.name = name;
			if (password) user.password = password;

			user.isSeller = isSeller;

			user.save();
			res.json({
				success: true,
				message: 'Successfully edited your profile'
			});
		});
	});

router
	.route('/address')
	.get(auth, (req, res) => {
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			res.json({
				success: true,
				address: user.address,
				message: 'Success'
			});
		});
	})
	.post(auth, (req, res, next) => {
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			if (err) return next(err);

			const { addr1, addr2, city, state, country, postalCode } = req.body;
			const { address } = user;
			if (addr1) address.addr1 = addr1;
			if (addr2) address.addr2 = addr2;
			if (city) address.city = city;
			if (country) address.country = country;
			if (postalCode) address.postalCode = postalCode;

			user.save();
			res.json({
				success: true,
				message: 'Successfully edited your address'
			});
		});
	});

module.exports = router;
